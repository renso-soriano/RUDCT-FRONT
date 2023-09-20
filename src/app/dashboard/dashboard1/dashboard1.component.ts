import { Component, OnInit, ViewChild } from '@angular/core';
import * as Chartist from 'chartist';
import { ChartType, ChartEvent } from "ng-chartist";
import ChartistTooltip from 'chartist-plugin-tooltips-updated';
import { DemandasService } from 'app/shared/services/mantenimientos/demandas.service';
import { EjeEnd } from 'app/shared/models/ejeEnd.enum';
import { Region } from 'app/shared/models/region.enum';
import { JsonPipe } from '@angular/common';
import { Observable } from 'rxjs';
import { MapSettings } from 'app/shared/models/Core/MapSettings.model';
import { MapaComponent } from 'app/shared/components/mapa/mapa.component';
import * as L from 'leaflet';
import { environment } from 'environments/environment';
import { LeafletMouseEvent } from 'app/shared/utilidades/utilidades';

declare var require: any;

const data: any = require('../../shared/data/chartist.json');

export interface Chart {
  type: ChartType;
  data: Chartist.IChartistData;
  options?: any;
  responsiveOptions?: any;
  events?: ChartEvent;
  // plugins?: any;
}

@Component({
  selector: 'app-dashboard1',
  templateUrl: './dashboard1.component.html',
  styleUrls: ['./dashboard1.component.scss']
})

export class Dashboard1Component implements OnInit {
  @ViewChild(MapaComponent) mapaComponent: MapaComponent;

  capas: any;
  locationsRegiones: any = [];
  locationsProvincias: any = [];
  locationsMunicipios: any = [];

  constructor(private demandasService: DemandasService) { }

  data2: any;
  dataDonuts: any;
  notFound = false;

  ejeInstitucional: number;
  ejeSocial: number;
  ejeEconomico: number;
  ejeMedioAmbiental: number;

  totalDemandas: number;

  cibaoNorte: number;
  cibaoSur: number;
  cibaoNordeste: number;
  cibaoNoroeste: number;
  valdesia: number;
  enriquillo: number;
  elValle: number;
  yuma: number;
  higuamo: number;
  ozama: number;

  mapSettings: MapSettings = {
    servicio: null,
    BindProperty: 'demandasPorProvincia',
    BindValue: 'totalDemandas',
    GeoDataFile: 'do_provincias',
    Label: 'Provincia'
  }
  referenciaMapa: string = 'provincial';


  ngOnInit() {
    this.mapSettings.servicio = this.demandasService.getDemandasForDashboard();

    this.demandasService.getDemandasForDashboard().subscribe((demandasFromTheAPI: any) => {
      this.data2 = demandasFromTheAPI;

      this.totalDemandas = this.data2.totalDemandas;
      this.ejeInstitucional = this.data2.demandasPorEje.find((demanda: any) => demanda.ejeId == EjeEnd.Institucionalidad)?.cantidad;
      this.ejeSocial = this.data2.demandasPorEje.find((demanda: any) => demanda.ejeId == EjeEnd.Social)?.cantidad;
      this.ejeEconomico = this.data2.demandasPorEje.find((demanda: any) => demanda.ejeId == EjeEnd.Economico)?.cantidad;
      this.ejeMedioAmbiental = this.data2.demandasPorEje.find((demanda: any) => demanda.ejeId == EjeEnd.MedioAmbiental)?.cantidad;

      this.cibaoNorte = this.data2.demandasPorRegion.find((demanda: any) => demanda.regionId == Region.CibaoNorte)?.porcentaje;
      this.cibaoSur = this.data2.demandasPorRegion.find((demanda: any) => demanda.regionId == Region.CibaoSur)?.porcentaje;
      this.cibaoNordeste = this.data2.demandasPorRegion.find((demanda: any) => demanda.regionId == Region.CibaoNordeste)?.porcentaje;
      this.cibaoNoroeste = this.data2.demandasPorRegion.find((demanda: any) => demanda.regionId == Region.CibaoNoroeste)?.porcentaje;
      this.valdesia = this.data2.demandasPorRegion.find((demanda: any) => demanda.regionId == Region.Valdesia)?.porcentaje;
      this.enriquillo = this.data2.demandasPorRegion.find((demanda: any) => demanda.regionId == Region.Enriquillo)?.porcentaje;
      this.elValle = this.data2.demandasPorRegion.find((demanda: any) => demanda.regionId == Region.ElValle)?.porcentaje;
      this.yuma = this.data2.demandasPorRegion.find((demanda: any) => demanda.regionId == Region.Yuma)?.porcentaje;
      this.higuamo = this.data2.demandasPorRegion.find((demanda: any) => demanda.regionId == Region.Higuamo)?.porcentaje;
      this.ozama = this.data2.demandasPorRegion.find((demanda: any) => demanda.regionId == Region.Ozama)?.porcentaje;

      this.locationsMunicipios = this.data2.demandaCoordenadasMunicipios;
      this.locationsProvincias = this.data2.demandaCoordenadasProvincias;
      this.loadUbicaciones(this.locationsProvincias);
      this.dataDonuts =
      {
        "series":
          [
            {
              "name": "cibaoNorte",
              "className": "ct-done",
              "value": this.cibaoNorte != undefined ? this.cibaoNorte : 0
            },
            {
              "name": "cibaoSur",
              "className": "ct-progress",
              "value": this.cibaoSur != undefined ? this.cibaoSur : 0
            },
            {
              "name": "cibaoNordeste",
              "className": "ct-outstanding",
              "value": this.cibaoNordeste != undefined ? this.cibaoNordeste : 0
            },
            {
              "name": "cibaoNoroeste",
              "className": "ct-started",
              "value": this.cibaoNoroeste != undefined ? this.cibaoNoroeste : 0
            },
            {
              "name": "valdesia",
              "className": "ct-finish2",
              "value": this.valdesia != undefined ? this.valdesia : 0
            },
            {
              "name": "enriquillo",
              "className": "ct-done2",
              "value": this.enriquillo != undefined ? this.enriquillo : 0
            },
            {
              "name": "elValle",
              "className": "ct-progress2",
              "value": this.elValle != undefined ? this.elValle : 0
            },
            {
              "name": "yuma",
              "className": "ct-started2",
              "value": this.yuma != undefined ? this.yuma : 0
            },
            {
              "name": "higuamo",
              "className": "ct-outstanding2",
              "value": this.higuamo != undefined ? this.higuamo : 0
            },

            {
              "name": "ozama",
              "className": "ct-finish",
              "value": this.ozama != undefined ? this.ozama : 0
            }
          ]
      }
      // asigna la data para el grafico de donats
      this.DonutChart.data = this.dataDonuts;
      //falseNeccesaryClick
      let click = document.getElementById("map");
      click.click();

    }, (err: any) => {
      console.error(err);
      this.notFound = true;
    });

  }

  loadUbicaciones(data) {

    this.capas = [];
    for (var i = 0; i < data.length; i++) {
      let lugar = [data[i].nombre]
      let latitud = Number([data[i].coordenadaX])
      let longitud = Number([data[i].coordenadaY])
      let demanda = [data[i].descripcion]
      let fuente = [data[i].fuente]
      let institucionResponsable = [data[i].institucionResponsable]
      let clasificadorFuncional = [data[i].clasificadorFuncional]
      let actividades = data[i].actividades
      let anio = [data[i].anio]
      let estado = [data[i].estado]

      //  let desgloseActividades:string ="";
      // for (var j = 0; j < actividades.length; j++) {
      //   desgloseActividades+="<br/>"+(j+1)+"-"+actividades[j].descripcion ;
      // }

      this.capas.push(
        L.marker([latitud, longitud], {
          icon: L.icon({
            iconSize: [25, 41],
            iconAnchor: [13, 41],
            iconUrl: 'assets/mapa/marker-icon.png',
            shadowUrl: 'assets/mapa/marker-shadow.png',
          })
        }).bindPopup(`
      <strong>Lugar:</strong> ${lugar} <br/>
      <strong>Demanda:</strong> ${demanda} <br/>
      <strong>Institucion responsable:</strong> ${institucionResponsable} <br/>
      <strong>Año:</strong> ${anio} <br/>
      <strong>Estado:</strong> ${estado} <br/>
      <strong>Fuente:</strong> ${fuente} <br/>
      <strong>Clasificador Funcional:</strong> ${clasificadorFuncional} <br/>
      <strong>Detalles:</strong><span > ${actividades}</span> <br/>`,

          {closeOnClick: true,  closeButton: false, autoClose: true, autoPan: true })

      );

    }
  }
  // Line area chart configuration Starts
  lineArea: Chart = {
    type: 'Line',
    data: data['lineAreaDashboard'],
    options: {
      low: 0,
      showArea: true,
      fullWidth: true,
      onlyInteger: true,
      axisY: {
        low: 0,
        scaleMinSpace: 50,
      },
      plugins: [
        ChartistTooltip({
          appendToBody: true,
          pointClass: 'ct-point-regular'
        })
      ],
      axisX: {
        showGrid: false
      }
    },
    events: {
      created(data: any): void {
        var defs = data.svg.elem('defs');
        defs.elem('linearGradient', {
          id: 'gradient',
          x1: 0,
          y1: 1,
          x2: 1,
          y2: 0
        }).elem('stop', {
          offset: 0,
          'stop-color': 'rgba(0, 201, 255, 1)'
        }).parent().elem('stop', {
          offset: 1,
          'stop-color': 'rgba(146, 254, 157, 1)'
        });

        defs.elem('linearGradient', {
          id: 'gradient1',
          x1: 0,
          y1: 1,
          x2: 1,
          y2: 0
        }).elem('stop', {
          offset: 0,
          'stop-color': 'rgba(132, 60, 247, 1)'
        }).parent().elem('stop', {
          offset: 1,
          'stop-color': 'rgba(56, 184, 242, 1)'
        });
      },
      draw(data: any): void {
        if (data.type === 'point') {
          var circle = new Chartist.Svg('circle', {
            cx: data.x,
            cy: data.y,
            r: 4,
            'ct:value': data.value.y,
            'ct:meta': data.meta,
            style: 'pointer-events: all !important',
            class: 'ct-point-regular'
          });
          data.element.replace(circle);
        }
      }
    },
  };
  // Line area chart configuration Ends

  // Stacked Bar chart configuration Starts
  Stackbarchart: Chart = {
    type: 'Bar',
    data: data['Stackbarchart'],
    options: {
      stackBars: true,
      fullWidth: true,
      axisX: {
        showGrid: false,
      },
      axisY: {
        showGrid: false,
        showLabel: false,
        offset: 0
      },
      chartPadding: 30
    },
    events: {
      created(data: any): void {
        var defs = data.svg.elem('defs');
        defs.elem('linearGradient', {
          id: 'linear',
          x1: 0,
          y1: 1,
          x2: 0,
          y2: 0
        }).elem('stop', {
          offset: 0,
          'stop-color': '#7441DB'
        }).parent().elem('stop', {
          offset: 1,
          'stop-color': '#C89CFF'
        });
      },
      draw(data: any): void {
        if (data.type === 'bar') {
          data.element.attr({
            style: 'stroke-width: 5px',
            x1: data.x1 + 0.001
          });

        }
        else if (data.type === 'label') {
          data.element.attr({
            y: 270
          })
        }
      }
    },
  };
  // Stacked Bar chart configuration Ends

  // Line area chart 2 configuration Starts
  lineArea2: Chart = {
    type: 'Line',
    data: data['lineArea2'],
    options: {
      showArea: true,
      fullWidth: true,
      lineSmooth: Chartist.Interpolation.none(),
      axisX: {
        showGrid: false,
      },
      axisY: {
        low: 0,
        scaleMinSpace: 50
      },
      plugins: [
        ChartistTooltip({
          appendToBody: true,
          pointClass: 'ct-point-circle'
        })
      ],
    },
    responsiveOptions: [
      ['screen and (max-width: 640px) and (min-width: 381px)', {
        axisX: {
          labelInterpolationFnc: function (value, index) {
            return index % 2 === 0 ? value : null;
          }
        }
      }],
      ['screen and (max-width: 380px)', {
        axisX: {
          labelInterpolationFnc: function (value, index) {
            return index % 3 === 0 ? value : null;
          }
        }
      }]
    ],
    events: {
      created(data: any): void {
        var defs = data.svg.elem('defs');
        defs.elem('linearGradient', {
          id: 'gradient2',
          x1: 0,
          y1: 1,
          x2: 0,
          y2: 0
        }).elem('stop', {
          offset: 0,
          'stop-opacity': '0.2',
          'stop-color': 'transparent'
        }).parent().elem('stop', {
          offset: 1,
          'stop-opacity': '0.2',
          'stop-color': '#60AFF0'
        });

        defs.elem('linearGradient', {
          id: 'gradient3',
          x1: 0,
          y1: 1,
          x2: 0,
          y2: 0
        }).elem('stop', {
          offset: 0.3,
          'stop-opacity': '0.2',
          'stop-color': 'transparent'
        }).parent().elem('stop', {
          offset: 1,
          'stop-opacity': '0.2',
          'stop-color': '#6CD975'
        });
      },
      draw(data: any): void {
        var circleRadius = 4;
        if (data.type === 'point') {

          var circle = new Chartist.Svg('circle', {
            cx: data.x,
            cy: data.y,
            r: circleRadius,
            'ct:value': data.value.y,
            'ct:meta': data.meta,
            style: 'pointer-events: all !important',
            class: 'ct-point-circle'
          });
          data.element.replace(circle);
        }
        else if (data.type === 'label') {
          // adjust label position for rotation
          const dX = data.width / 2 + (30 - data.width)
          data.element.attr({ x: data.element.attr('x') - dX })
        }
      }
    },
  };
  // Line area chart 2 configuration Ends

  // Line chart configuration Starts
  lineChart: Chart = {
    type: 'Line', data: data['LineDashboard'],
    options: {
      axisX: {
        showGrid: false
      },
      axisY: {
        showGrid: false,
        showLabel: false,
        low: 0,
        high: 100,
        offset: 0,
      },
      plugins: [
        ChartistTooltip({
          appendToBody: true,
          currency: '$',
          pointClass: 'ct-point-circle'
        })
      ],
      fullWidth: true,
      offset: 0,
    },
    events: {
      draw(data: any): void {
        var circleRadius = 4;
        if (data.type === 'point') {
          var circle = new Chartist.Svg('circle', {
            cx: data.x,
            cy: data.y,
            r: circleRadius,
            'ct:value': data.value.y,
            'ct:meta': data.meta,
            style: 'pointer-events: all !important',
            class: 'ct-point-circle'
          });

          data.element.replace(circle);
        }
        else if (data.type === 'label') {
          // adjust label position for rotation
          const dX = data.width / 2 + (30 - data.width)
          data.element.attr({ x: data.element.attr('x') - dX })
        }
      }
    },

  };
  // Line chart configuration Ends

  // Donut chart configuration Starts
  DonutChart: Chart = {
    type: 'Pie',
    data: data['donutDashboard'],
    options: {
      donut: true,
      startAngle: 0,
      labelInterpolationFnc: function (value) {
        var total = data['donutDashboard'].series.reduce(function (prev, series) {
          return prev + series.value;
        }, 0);
        return total + '%';
      }
    },
    events: {
      draw(data: any): void {
        if (data.type === 'label') {
          if (data.index === 0) {
            data.element.attr({
              dx: data.element.root().width() / 2,
              dy: data.element.root().height() / 2
            });
          } else {
            data.element.remove();
          }
        }

      }
    }
  };
  // Donut chart configuration Ends

  //  Bar chart configuration Starts
  BarChart: Chart = {
    type: 'Bar', data: data['DashboardBar'], options: {
      axisX: {
        showGrid: false,
      },
      axisY: {
        showGrid: false,
        showLabel: false,
        offset: 0
      },
      low: 0,
      high: 60, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
    },
    responsiveOptions: [
      ['screen and (max-width: 640px)', {
        seriesBarDistance: 5,
        axisX: {
          labelInterpolationFnc: function (value) {
            return value[0];
          }
        }
      }]
    ],
    events: {
      created(data: any): void {
        var defs = data.svg.elem('defs');
        defs.elem('linearGradient', {
          id: 'gradient4',
          x1: 0,
          y1: 1,
          x2: 0,
          y2: 0
        }).elem('stop', {
          offset: 0,
          'stop-color': '#8E1A38'
        }).parent().elem('stop', {
          offset: 1,
          'stop-color': '#FAA750'
        });
        defs.elem('linearGradient', {
          id: 'gradient5',
          x1: 0,
          y1: 1,
          x2: 0,
          y2: 0
        }).elem('stop', {
          offset: 0,
          'stop-color': '#1750A5'
        }).parent().elem('stop', {
          offset: 1,
          'stop-color': '#40C057'
        });

        defs.elem('linearGradient', {
          id: 'gradient6',
          x1: 0,
          y1: 1,
          x2: 0,
          y2: 0
        }).elem('stop', {
          offset: 0,
          'stop-color': '#3B1C93'
        }).parent().elem('stop', {
          offset: 1,
          'stop-color': '#60AFF0'
        });
        defs.elem('linearGradient', {
          id: 'gradient7',
          x1: 0,
          y1: 1,
          x2: 0,
          y2: 0
        }).elem('stop', {
          offset: 0,
          'stop-color': '#562DB7'
        }).parent().elem('stop', {
          offset: 1,
          'stop-color': '#F55252'
        });

      },
      draw(data: any): void {
        var barHorizontalCenter, barVerticalCenter, label, value;
        if (data.type === 'bar') {

          data.element.attr({
            y1: 195,
            x1: data.x1 + 0.001
          });

        }
      }
    },

  };
  // Bar chart configuration Ends

  // line chart configuration Starts
  WidgetlineChart: Chart = {
    type: 'Line', data: data['Dashboard1_WidgetlineChart'],
    options: {
      axisX: {
        showGrid: false,
        showLabel: false,
        offset: 0
      },
      axisY: {
        showGrid: false,
        low: 40,
        showLabel: false,
        offset: 0
      },
      plugins: [
        ChartistTooltip({
          appendToBody: true,
          currency: '$',
          pointClass: 'ct-point-regular'
        })
      ],
      lineSmooth: Chartist.Interpolation.cardinal({
        tension: 0
      }),
      fullWidth: true
    },
    events: {
      draw(data: any): void {
        if (data.type === 'point') {
          var circle = new Chartist.Svg('circle', {
            cx: data.x,
            cy: data.y,
            r: 4,
            'ct:value': data.value.y,
            'ct:meta': data.meta,
            style: 'pointer-events: all !important',
            class: 'ct-point-regular'
          });
          data.element.replace(circle);
        }
      }
    }
  };
  // Line chart configuration Ends

  // line chart configuration Starts
  WidgetlineChart1: Chart = {
    type: 'Line', data: data['Dashboard1_WidgetlineChart1'],
    options: {
      axisX: {
        showGrid: false,
        showLabel: false,
        offset: 0
      },
      axisY: {
        showGrid: false,
        low: 40,
        showLabel: false,
        offset: 0
      },
      plugins: [
        ChartistTooltip({
          appendToBody: true,
          currency: '$',
          pointClass: 'ct-point-regular'
        })
      ],
      lineSmooth: Chartist.Interpolation.cardinal({
        tension: 0
      }),
      fullWidth: true
    },
    events: {
      draw(data: any): void {
        if (data.type === 'point') {
          var circle = new Chartist.Svg('circle', {
            cx: data.x,
            cy: data.y,
            r: 4,
            'ct:value': data.value.y,
            'ct:meta': data.meta,
            style: 'pointer-events: all !important',
            class: 'ct-point-regular'
          });
          data.element.replace(circle);
        }
      }
    }
  };
  // Line chart configuration Ends

  // line chart configuration Starts
  WidgetlineChart2: Chart = {
    type: 'Line', data: data['Dashboard1_WidgetlineChart2'],
    options: {
      axisX: {
        showGrid: false,
        showLabel: false,
        offset: 0
      },
      axisY: {
        showGrid: false,
        low: 40,
        showLabel: false,
        offset: 0
      },
      plugins: [
        ChartistTooltip({
          appendToBody: true,
          currency: '$',
          pointClass: 'ct-point-regular'
        })
      ],
      lineSmooth: Chartist.Interpolation.cardinal({
        tension: 0
      }),
      fullWidth: true
    },
    events: {
      draw(data: any): void {
        if (data.type === 'point') {
          var circle = new Chartist.Svg('circle', {
            cx: data.x,
            cy: data.y,
            r: 4,
            'ct:value': data.value.y,
            'ct:meta': data.meta,
            style: 'pointer-events: all !important',
            class: 'ct-point-regular'
          });
          data.element.replace(circle);
        }
      }
    }
  };
  // Line chart configuration Ends

  // line chart configuration Starts
  WidgetlineChart3: Chart = {
    type: 'Line', data: data['Dashboard1_WidgetlineChart3'],
    options: {
      axisX: {
        showGrid: false,
        showLabel: false,
        offset: 0
      },
      axisY: {
        showGrid: false,
        low: 40,
        showLabel: false,
        offset: 0
      },
      plugins: [
        ChartistTooltip({
          appendToBody: true,
          currency: '$',
          pointClass: 'ct-point-regular'
        })
      ],
      lineSmooth: Chartist.Interpolation.cardinal({
        tension: 0
      }),
      fullWidth: true
    },
    events: {
      draw(data: any): void {
        if (data.type === 'point') {
          var circle = new Chartist.Svg('circle', {
            cx: data.x,
            cy: data.y,
            r: 4,
            'ct:value': data.value.y,
            'ct:meta': data.meta,
            style: 'pointer-events: all !important',
            class: 'ct-point-regular'
          });
          data.element.replace(circle);
        }
      }
    }
  };
  // Line chart configuration Ends

  onResized(event: any) {
    setTimeout(() => {
      this.fireRefreshEventOnWindow();
    }, 300);
  }

  fireRefreshEventOnWindow = function () {
    var evt = document.createEvent("HTMLEvents");
    evt.initEvent("resize", true, false);
    window.dispatchEvent(evt);
  };
  changeMap(event: any) {
    switch (event.target.value) {
      case '1':
        this.loadUbicaciones(this.locationsProvincias);
        this.referenciaMapa = 'Provincial';
        break;

      case '2':
        this.loadUbicaciones(this.locationsMunicipios);
        this.referenciaMapa = 'Municipal';
        break;

      default:
        break;
    }

    //this.mapaComponent.onReload(this.mapSettings);
  }
  /* changeMap(event: any) {
     switch (event.target.value) {
       case '1':
         this.mapSettings.GeoDataFile = 'do_provincias';
         this.mapSettings.BindProperty = 'demandasPorProvincia';
         this.mapSettings.BindValue = 'totalDemandas';
         this.mapSettings.Label = 'Provincia';
         this.referenciaMapa = 'Provincias';
         break;

       case '2':
         this.mapSettings.GeoDataFile = 'do_municipios';
         this.mapSettings.BindProperty = 'demandasPorMunicipio';
         this.mapSettings.BindValue = 'totalDemandas';
         this.mapSettings.Label = 'Municipio';
         this.referenciaMapa = 'Municipios';
         break;

       default:
         break;
     }

     this.mapaComponent.onReload(this.mapSettings);
   }*/
  options = {
    layers: [
      L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        minZoom: 8,
        maxZoom: 20,
        attribution: '',
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: environment.InicializarMapa.accessToken,
      }),
    ],
    zoomControl: true,
    zoomSnap: 0.25,
    zoomDelta: 0.5,
    zoom: 8.30,


    center: L.latLng(environment.InicializarMapa.coordenadaX, environment.InicializarMapa.coordenadaY)
  };
  manejarClick(event: LeafletMouseEvent) {

    // const latitud = Number( event.latlng.lat);
    // const longitud =Number(event.latlng.lng) ;
    // console.log(event.latlng)
    // this.capas = [];
    // this.capas.push(
    //     L.marker([latitud, longitud], {
    //       icon: L.icon({
    //         iconSize: [25, 41],
    //         iconAnchor: [13, 41],
    //         iconUrl: 'assets/mapa//marker-icon.png',
    //         shadowUrl: 'assets/mapa/marker-shadow.png',
    //       })
    //     }).bindPopup(`
    //     <strong>Coordenada X:</strong> ${latitud} <br/>
    //     <strong>Coordenada Y:</strong> ${longitud}`,
    //     { autoClose: false, autoPan: true })

    //   );
  }
}
