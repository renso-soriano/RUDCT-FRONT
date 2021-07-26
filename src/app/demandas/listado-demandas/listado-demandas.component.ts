import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { DatatableData } from './data/datatables.data';
import {
  ColumnMode,
  DatatableComponent,
  SelectionType
} from '@swimlane/ngx-datatable';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { DemandasService } from 'app/shared/services/demandas.service';

/* declare var require: any;
const data: any = require('../../shared/data/Demandas.json'); */


@Component({
  selector: 'app-listado-demandas',
  templateUrl: './listado-demandas.component.html',
  styleUrls: ['./listado-demandas.component.scss', '../../../assets/sass/libs/datatables.scss'],
  encapsulation: ViewEncapsulation.None})
export class ListadoDemandasComponent implements OnInit {

    loadingIndicator: boolean = true;
    reorderable: boolean = true;

  // public
  public contentHeader: object;

  data:any[];
  notFound =false;

  // row data
  public rows;

  // column header
  public columns = [
    { name:'Codigo', prop: 'Codigo Demanda'},
    { prop: 'Demanda'},
    { prop: 'Año'},
    { name:'Origen', prop: 'Origen Demanda'},
    { name:'Estado', prop: 'Estado Ejecucion'}
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
  public serverSideRowData;

  // private
  private tempData = [];
  private multiPurposeTemp = [];

  /**
   * inlineEditingUpdate
   *
   * @param event
   * @param cell
   * @param rowIndex
   */
  inlineEditingUpdate(event, cell, rowIndex) {
    this.editing[rowIndex + '-' + cell] = false;
    this.rows[rowIndex][cell] = event.target.value;
    this.rows = [...this.rows];
  }

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
   * customChkboxOnSelect
   *
   * @param { selected }
   */
  customChkboxOnSelect({ selected }) {
    this.chkBoxSelected.splice(0, this.chkBoxSelected.length);
    this.chkBoxSelected.push(...selected);
  }

  /**
   * serverSideSetPage
   *
   * @param event
   */
  serverSideSetPage(event) {
    this.http
      .get('assets/data/datatable-data.json')
      .pipe(map((data) => data as Array<any>))
      .subscribe((data) => {
        this.serverSideRowData = data;
      });
  }

  /**
   * MultiPurposeFilterUpdate
   *
   * @param event
   */
  MultiPurposeFilterUpdate(event) {
    const val = event.target.value.toLowerCase();

    // filter our data
    const temp = this.multiPurposeTemp.filter(function (d) {
      return d.full_name.toLowerCase().indexOf(val) !== -1 || !val;
    });

    // update the rows
    this.multiPurposeRows = temp;
    // Whenever the filter changes, always go back to the first page
    this.table.offset = 0;
  }

  /**
   * Constructor
   *
   * @param {HttpClient} http
   */
  constructor(private http: HttpClient, private demandasService:DemandasService ) {
    this.tempData = DatatableData;
    this.multiPurposeTemp = DatatableData;
    setTimeout(() => { this.loadingIndicator = false; }, 1500);
  }

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit() {
    // Initially load first page
    this.serverSideSetPage({ offset: 0 });

    this.demandasService.getDemandas().subscribe((demandasFromTheAPI : any) => {
      this.data = demandasFromTheAPI;
      this.rows =this.data;
    }, (err: any) => {
      console.error(err);
      this.notFound = true;
    });

    // content header
    this.contentHeader = {
      headerTitle: 'Datatables',
      actionButton: true,
      breadcrumb: {
        type: '',
        links: [
          {
            name: 'Home',
            isLink: true,
            link: '#'
          },
          {
            name: 'Forms & Tables',
            isLink: true,
            link: ''
          },
          {
            name: 'Datatables',
            isLink: false
          }
        ]
      }
    };
  }
}






/* implements OnInit {

  ngOnInit(): void {
  }

  rows = [];
  loadingIndicator: boolean = true;
  reorderable: boolean = true;

  columns = [
      { name:'Codigo', prop: 'Codigo Demanda'},
      { prop: 'Demanda'},
      { prop: 'Año'},
      { name:'Origen', prop: 'Origen Demanda'},
      { prop: 'Provincia'},
      { name:'Estado', prop: 'Estado Ejecucion'},
      { name: 'Acciones'}


  ];

  constructor() {

      this.rows = data;
      setTimeout(() => { this.loadingIndicator = false; }, 1500);
  }


} */
