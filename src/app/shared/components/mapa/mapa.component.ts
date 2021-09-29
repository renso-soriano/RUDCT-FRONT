import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { environment } from 'environments/environment';
import { DecimalPipe } from '@angular/common';
import { DemandasService } from 'app/shared/services/mantenimientos/demandas.service';
import { Observable } from 'rxjs';
import { MapSettings } from 'app/shared/models/Core/MapSettings.model';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.scss']
})
export class MapaComponent implements OnInit, AfterViewInit {
  @Input() GEO_DATA_FILE: string;
  @Input() LABEL: string;
  @Input() BIND_PROP: string;
  @Input() BIND_PROP_VALUE: string;
  @Input() EXTRA_DATA_SERVICE: Observable<any>; // Este Input recibe el servicio para los datos adicionales a mostrar en el tooltip asociados a la tiponimia mostrada

  loading = true;

  private GEO_DATA_PATH = "./assets/data/geoJSON";
  private map: any;
  private initMap(): void {
    this.map = L.map('map', {
      //center: [39.8282, -98.5795],
      zoomControl: true
    }).fitBounds([[17.42830546493801, -72.72962230404555], [20.10398324046639, -67.20292132208162]]);
  }

  private bounds_group = L.featureGroup([]);
  private layer_PROVCenso2010_0: any;
  params: any;
  dataExtra: any;
  private totalDemandas: number = 0;

  constructor(
    private http: HttpClient,
    private decimalPipe: DecimalPipe,
    private demandaService: DemandasService,
    private spinner: NgxSpinnerService,
  ) {

  }

  ngOnInit(): void {
    console.log(this.LABEL)
  }

  getGeoJSON() {
    let p = new Promise<any>((resolve, reject) => {
      this.http.get(`${this.GEO_DATA_PATH}/${this.GEO_DATA_FILE}.json`)
        .toPromise()
        .then(
          (res: any) => {
            resolve(res);
          },
          (err: any) => reject(err)
        );
    });
    return p;
  }

  async onReload(mapSettings?: MapSettings){
    if(mapSettings != undefined) {
      this.BIND_PROP = mapSettings.BindProperty;
      this.BIND_PROP_VALUE = mapSettings.BindValue;
      this.GEO_DATA_FILE = mapSettings.GeoDataFile;
    }
    this.loading = true;
    this.spinner.show();
    //filter
    this.getGeoJSON().then((res) => {
      this.EXTRA_DATA_SERVICE
        .subscribe(
          (result: any) => {
            this.totalDemandas = result[this.BIND_PROP_VALUE];
            (res.features).forEach((e: any) => {
              const arr = result[this.BIND_PROP];
              const _toponimia = this.replaceTick(e.properties.TOPONIMIA);
              arr.find((object, index) => {
                if (this.replaceTick(object.nombre) === _toponimia) {
                  e.properties['color'] = this.getFillFeatureColor(this.totalDemandas, object.cantidad == undefined ? 0 : object.cantidad);
                  e.properties['demandas'] = this.decimalPipe.transform(object.cantidad == undefined ? 0 : object.cantidad, '0.2-2');
                  e.properties['label'] = this.LABEL;
                }
              });
            });
          },
          (err: any) => console.log(err),
          () => {
            this.loading = false;
            this.spinner.hide();
            document.body.click();
            setTimeout(() => {
              this.initMap();
              this.map.attributionControl.setPrefix(`<span style="font-weight:bold;color:#003876;">©${new Date().getFullYear()}. <a style="font-weight:bold;color:#003876!important;" href="https://mepyd.gob.do" target="_blank">MEPyD</a>. Todos Los Derechos Reservados.</span>`);
              this.map.createPane('pane_PROVCenso2010_0');
              this.map.getPane('pane_PROVCenso2010_0').style.zIndex = 400;
              this.map.getPane('pane_PROVCenso2010_0').style['mix-blend-mode'] = 'normal';
              this.layer_PROVCenso2010_0 = L.geoJSON(res, {
                attribution: '',
                interactive: true,
                pane: 'pane_PROVCenso2010_0',
                onEachFeature: this.pop_PROVCenso2010_0,
                style: this.style_PROVCenso2010_0_0,
              });

              this.bounds_group.addLayer(this.layer_PROVCenso2010_0);
              this.map.addLayer(this.layer_PROVCenso2010_0);
              this.setBounds();
            this.map.setZoom(8);
            }, 500);
          }
        );
    });
  }

  ngAfterViewInit(): void {
    this.onReload();
  }

  setBounds(): void {
  }

  pop_PROVCenso2010_0(feature: any, layer: any): void {
    var popupContent = '<table style="min-width:300px !important;">\
        <tr>\
            <td colspan="2"><b>'+ (feature.properties['label']) + ':</b> ' + (feature.properties['TOPONIMIA']) + '</td>\
        </tr>\
        <tr>\
            <td colspan="2"><b>Catidad de demandas:</b> ' + (feature.properties['demandas'] == undefined ? 0 : feature.properties['demandas']) + '</td>\
        </tr>\
    </table>';
    layer.bindPopup(popupContent, { maxHeight: 400 });
  }

  style_PROVCenso2010_0_0(feature: any): any {
    return {
      pane: 'pane_PROVCenso2010_0',
      opacity: 1,
      color: 'rgba(0,56,118,1.0)',
      dashArray: '',
      lineCap: 'butt',
      lineJoin: 'miter',
      weight: 1.0,
      fill: true,
      fillOpacity: 1,
      fillColor: feature.properties.color != undefined ? feature.properties.color : 'rgba(0,56,118,0)',
      interactive: true,
    }
  }

  replaceTick(str: string): string {
    const replaceObj = environment.specialChars;
    const regex = /[À-ú]/gm;
    const coincidencias = str.match(regex);
    if (coincidencias != undefined && coincidencias.length > 0) {
      coincidencias.forEach(char => {
        if (replaceObj[char] != undefined) {
          str = str.replace(char, replaceObj[char])
        }
      });
    }
    return str.trim();
  }

  /**
   *
   * @param presupuestoAprobadoTotal
   * @param presupuestoAprobadoProvincia
   * @returns string rgba color fill
   */
  getFillFeatureColor(total: number, cantidad: number): string {
    const porcentaje = (cantidad * 100) / total;
    const opacity = ((porcentaje)/100)+0.1 >= 1 ? 0.9 : ((porcentaje)/100);
    return `rgba(0,56,118,${ opacity})`;
  }

}
