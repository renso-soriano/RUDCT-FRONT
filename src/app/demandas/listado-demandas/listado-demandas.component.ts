import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { DatatableData } from './data/datatables.data';
import {
  ColumnMode,
  DatatableComponent,
  SelectionType
} from '@swimlane/ngx-datatable';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { DemandasService } from 'app/shared/services/mantenimientos/demandas.service';
import { Router } from '@angular/router';
import * as alertFunctions from '../../shared/data/sweet-alerts';
import { Observable } from 'rxjs';
import { Demanda } from 'app/shared/models/Demandas/Demanda.model';
import { FiltrosDinamicos } from 'app/shared/models/Core/filtros-dinamicos.model';
import { DropDownServiceService } from 'app/shared/services/drop-down-service.service';
import { environment } from 'environments/environment';

declare var require: any;
const data: any = require('../../shared/data/Demandas.json');

@Component({
  selector: 'app-listado-demandas',
  templateUrl: './listado-demandas.component.html',
  styleUrls: ['./listado-demandas.component.scss', '../../../assets/sass/libs/datatables.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ListadoDemandasComponent implements OnInit {

  loadingIndicator: boolean = true;
  reorderable: boolean = true;

  // public
  public contentHeader: object;

  //data:any[];
  notFound = false;

  // row data
  public rows = data;
  limitSelected: any = 10;

  page = {
    limit: this.limitSelected,
    count: 0,
    offset: 0
  }

  limitSelect: any = [
    { value: 10, label: 10 },
    { value: 25, label: 25 },
    { value: 50, label: 50 },
    { value: 100, label: 100 },
  ];

  public filtros: FiltrosDinamicos[];

  filtrosActivos: any = {
    "anio": null,
    "regionId": null,
    "provinciaId": null,
    "municipioId": null,
    "fuenteDemandaId": null,
    "temaComunId": null,
    "institucionId": null,
    "demandaTipoId": null
  }

  // column header
  public columns = [
    { name: 'Código', prop: 'codigo', sorteable: false },
    { name: 'Año', prop: 'anio', sorteable: false },
    { name: 'Región', prop: 'nombreRegion', sorteable: false },
    { name: 'Provincia', prop: 'nombreProvincia', sorteable: false },
    { name: 'Municipio', prop: 'nombreMunicipio', sorteable: false },
    { name: 'Origen', prop: 'nombreFuenteDemanda', sorteable: false },
    { name: 'Estado', prop: 'nombreEstadoDemanda', sorteable: false },
  ];

  // multi Purpose datatable Row data
  public multiPurposeRows = DatatableData;

  public ColumnMode = ColumnMode;

  @ViewChild(DatatableComponent) table: DatatableComponent;
  @ViewChild('tableRowDetails') tableRowDetails: any;
  @ViewChild('tableResponsive') tableResponsive: any;

  public expanded: any = {};

  public editing = {};

  public chkBoxSelected = [];
  public SelectionType = SelectionType;

  // server side row data
  public rowService: Observable<any>;

  // private
  private tempData = [];
  private multiPurposeTemp = [];

  /**
   * filterUpdate
   *
   * @param code
   */
  filterUpdate(event) {
    const val = event.target.value.toLowerCase();

    // filter our data
    const temp = this.tempData.filter(function (d) {
      return d.Demanda.toLowerCase().indexOf(val) !== -1 || !val;
    });

    // update the rows
    this.rows = temp;
    // Whenever the filter changes, always go back to the first page
    this.table.offset = 0;
  }

  /**
   * rowDetailsToggleExpand
   *
   * @param row
   */
  rowDetailsToggleExpand(row) {
    this.tableRowDetails.rowDetail.toggleExpandRow(row);
  }

  /**
   * toggleExpandRowResponsive
   *
   * @param row
   */
  toggleExpandRowResponsive(row) {
    this.tableResponsive.rowDetail.toggleExpandRow(row);
  }

  /**
   * Constructor
   *
   * @param {HttpClient} http
   */
  constructor(private http: HttpClient, private demandasService: DemandasService,
    private router: Router, private dropdownService: DropDownServiceService) {
    this.tempData = data;
    this.multiPurposeTemp = DatatableData;
    setTimeout(() => { this.loadingIndicator = false; }, 1500);
  }

  //Actions Methods

  verDetalles(CodigoDemanda: string) {
    this.router.navigate(["/demandas", 'Details', CodigoDemanda]);
  }
  editar(CodigoDemanda: string) {
    this.router.navigate(["/demandas", 'Edit', CodigoDemanda]);
  }
  eliminar(CodigoDemanda: string) {
    alertFunctions.EliminarRegistro("/demandas",this.demandasService.deleteDemanda(CodigoDemanda));

  }

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit() {
    // Initially load first page
    this.pageCallback({ offset: 0 });
    this.filtros = [
      new FiltrosDinamicos().deserialize({
        name: 'anio',
        label: 'Año',
        servicio: this.setFilterAnnios(),
        tipo: 'select',
        placeholder: 'Seleccione un año',
        async: false,
        multiple: false
      }),
      new FiltrosDinamicos().deserialize({
        name: 'regionId',
        label: 'Región',
        servicio: this.dropdownService.getRegiones(),
        tipo: 'select',
        placeholder: 'Seleccione una región',
        async: true,
        multiple: false,
        filtroHijo: 'provinciaId',
        servicioHijo: 'getProvinciasByRegion',
      }),
      new FiltrosDinamicos().deserialize({
        name: 'provinciaId',
        label: 'Provincia',
        servicio: this.dropdownService.getProvinciasByRegion(null),
        tipo: 'select',
        placeholder: 'Seleccione una provincia',
        async: true,
        multiple: false,
        filtroHijo: 'municipioId',
        servicioHijo: 'getMunicipiosByProvincia',
      }),
      new FiltrosDinamicos().deserialize({
        name: 'municipioId',
        label: 'Municipio',
        servicio: this.dropdownService.getMunicipiosByProvincia(null),
        tipo: 'select',
        placeholder: 'Seleccione un municipio',
        async: true,
        multiple: false
      }),
      new FiltrosDinamicos().deserialize({
        name: 'fuenteDemandaId',
        label: 'Fuente',
        servicio: this.dropdownService.getFuentes(),
        tipo: 'select',
        placeholder: 'Seleccione una fuente de demanda',
        async: true,
        multiple: false
      }),
      /* new FiltrosDinamicos().deserialize({
        name: 'estadoId',
        label: 'Estado',
        servicio: this.dropdownService.getEstados(),
        tipo: 'select',
        placeholder: 'Seleccione un estado',
        async: true,
        multiple: false
      }), */
      new FiltrosDinamicos().deserialize({
        name: 'temaComunId',
        label: 'Tema común',
        servicio: this.dropdownService.getTemasComunes(),
        tipo: 'select',
        placeholder: 'Seleccione un tema común',
        async: true,
        multiple: false
      }),
      new FiltrosDinamicos().deserialize({
        name: 'institucionId',
        label: 'Institución responsable',
        servicio: this.dropdownService.getInstituciones(),
        tipo: 'select',
        placeholder: 'Seleccione una región',
        async: true,
        multiple: false
      })
      ,
      new FiltrosDinamicos().deserialize({
        name: 'demandaTipoId',
        label: 'Tipo Demanda',
        servicio: this.dropdownService.getTiposDemandas(),
        tipo: 'select',
        placeholder: 'Seleccione un tipo',
        async: true,
        multiple: false
      })
    ];
    this.loadingIndicator = false;
  }

  setFilterAnnios(): any[] {
    const annioInicial = environment.appStartYear;
    const annioActual = new Date().getFullYear();
    let annios = [];
    for (let i = annioInicial; i <= annioActual; i++) {
      annios.push({ id: i, name: i });
    }
    return annios;
  }

  async pageCallback(pageInfo: { count?: number, pageSize?: number, limit?: number, offset?: number }) {
    this.page.offset = pageInfo.offset;
    await this.reloadTable();
  }

  async getFilters(event) {
    this.filtrosActivos = event;
    this.page.offset = 0;
    await this.reloadTable();
  }

  async reloadTable() {
    const params = new HttpParams()
      .set('Page', `${this.page.offset + 1}`)
      .set('Take', `${this.page.limit}`)
      .set('anio', this.filtrosActivos.anio)
      .set('regionId', this.filtrosActivos.regionId)
      .set('provinciaId', this.filtrosActivos.provinciaId)
      .set('municipioId', this.filtrosActivos.municipioId)
      .set('fuenteDemandaId', this.filtrosActivos.fuenteDemandaId)
      .set('temaComunId', this.filtrosActivos.temaComunId)
      .set('institucionId', this.filtrosActivos.institucionId)
      .set('demandaTipoId', this.filtrosActivos.demandaTipoId)
    this.demandasService.getDemandas(params).subscribe((data: any) => {
      // NOTE: the format of the returned data depends on your API!
      this.page.count = data.total;
      this.rows = data.items;
      document.body.click();
    });
  }

  public async _changeRowLimits(event: any) {
    this.page.limit = this.limitSelected;
    await this.reloadTable();
  }
}
