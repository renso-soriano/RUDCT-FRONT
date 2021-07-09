import { Component, OnInit } from '@angular/core';

declare var require: any;
const data: any = require('../../shared/data/Demandas.json');


@Component({
  selector: 'app-listado-demandas',
  templateUrl: './listado-demandas.component.html',
  styleUrls: ['./listado-demandas.component.scss']
})
export class ListadoDemandasComponent implements OnInit {

  ngOnInit(): void {
  }

  rows = [];
  loadingIndicator: boolean = true;
  reorderable: boolean = true;

  columns = [
      { prop: 'Codigo Demanda'},
      { prop: 'Año'},
      { prop: 'Demanda'},
      { prop: 'Origen Demanda'},
      { prop: 'Provincia'},
      { prop: 'Estado Ejecucion'}

  ];

  constructor() {

      this.rows = data;
      setTimeout(() => { this.loadingIndicator = false; }, 1500);
  }


}
