import { Component, Input, OnInit } from '@angular/core';
import * as Chartist from 'chartist';
import { ChartType, ChartEvent } from "ng-chartist";
import { Region } from 'app/shared/models/region.enum';
import { DemandasPorRegion } from 'app/shared/models/auth/gobierno-abierto.model';


declare var require: any;
const data: any = require('app/shared/data/chartist.json');

export interface Chart {
  type: ChartType;
  data: Chartist.IChartistData;
  options?: any;
  responsiveOptions?: any;
  events?: ChartEvent;
  // plugins?: any;
}


@Component({
  selector: 'app-region-chart',
  templateUrl: './region-chart.component.html',
  styleUrls: ['./region-chart.component.scss']
})
export class RegionChartComponent implements OnInit {


  @Input() regionesInfo: DemandasPorRegion[]
  constructor() { }

  data2: any;
  dataDonuts: any;


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

  ngOnInit(): void {

    this.data2 = this.regionesInfo;
    this.initAll(this.data2);

  }

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

  reloadAll(data):void
  {
    this.data2 = data;
    this.initAll(this.data2);

  }

  initAll(data):void
  {
console.log("cargando la data =>" ,data)
    this.cibaoNorte = data.find((res: any) => res.enlace == Region.CibaoNorte)?.porcentaje ?? 0;
    this.cibaoSur = data.find((res: any) => res.enlace == Region.CibaoSur)?.porcentaje  ?? 0;
    this.cibaoNordeste = data.find((res: any) => res.enlace == Region.CibaoNordeste)?.porcentaje ?? 0;
    this.cibaoNoroeste = data.find((res: any) => res.enlace == Region.CibaoNoroeste)?.porcentaje ?? 0;
    this.valdesia = data.find((res: any) => res.enlace == Region.Valdesia)?.porcentaje ?? 0;
    this.enriquillo = data.find((res: any) => res.enlace == Region.Enriquillo)?.porcentaje ?? 0;
    this.elValle = data.find((res: any) => res.enlace == Region.ElValle)?.porcentaje ?? 0;
    this.yuma = data.find((res: any) => res.enlace == Region.Yuma)?.porcentaje ?? 0;
    this.higuamo = data.find((res: any) => res.enlace == Region.Higuamo)?.porcentaje ?? 0;
    this.ozama = data.find((res: any) => res.enlace == Region.Ozama)?.porcentaje ?? 0;

    this.dataDonuts =
      {
        "series":
          [
            {
              "name": "cibaoNorte",
              "className": "ct-done",
              "value": this.cibaoNorte
            },
            {
              "name": "cibaoSur",
              "className": "ct-progress",
              "value": this.cibaoSur
            },
            {
              "name": "cibaoNordeste",
              "className": "ct-outstanding",
              "value": this.cibaoNordeste
            },
            {
              "name": "cibaoNoroeste",
              "className": "ct-started",
              "value": this.cibaoNoroeste
            },
            {
              "name": "valdesia",
              "className": "ct-finish2",
              "value": this.valdesia
            },
            {
              "name": "enriquillo",
              "className": "ct-done2",
              "value": this.enriquillo
            },
            {
              "name": "elValle",
              "className": "ct-progress2",
              "value": this.elValle
            },
            {
              "name": "yuma",
              "className": "ct-started2",
              "value": this.yuma
            },
            {
              "name": "higuamo",
              "className": "ct-outstanding2",
              "value": this.higuamo
            },

            {
              "name": "ozama",
              "className": "ct-finish",
              "value": this.ozama
            }
          ]
      }
      // asigna la data para el grafico de donats
      this.DonutChart.data = this.dataDonuts;

  }




}
