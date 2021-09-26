import {
  Component,
  OnInit,
  ViewEncapsulation,
  ViewChild,
  ElementRef,
} from "@angular/core";
import { DatatableData } from "./data/datatables.data";
import {
  ColumnMode,
  DatatableComponent,
  SelectionType,
} from "@swimlane/ngx-datatable";
import { map } from "rxjs/operators";
import * as alertFunctions from "../../../shared/data/sweet-alerts";
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { TecnicosService } from 'app/shared/services/mantenimientos/tecnicos.service';

@Component({
  selector: 'app-listado-tecnicos',
  templateUrl: './listado-tecnicos.component.html',
  styleUrls: ['./listado-tecnicos.component.scss',
  "../../../../assets/sass/libs/datatables.scss",
],
encapsulation: ViewEncapsulation.None
})
export class ListadoTecnicosComponent implements OnInit {
  loadingIndicator: boolean = true;
  reorderable: boolean = true;

  // public
  public contentHeader: object;
  data: any[];
  notFound = false;

  // row data
  // public rows = data;
  public rows = [];

  // column header
  public columns = [{ name: "Categoria beneficiario", prop: "nombre" }];

  // multi Purpose datatable Row data
  public multiPurposeRows = DatatableData;

  public ColumnMode = ColumnMode;

  @ViewChild(DatatableComponent) table: DatatableComponent;
  @ViewChild("tableRowDetails") tableRowDetails: any;
  @ViewChild("tableResponsive") tableResponsive: any;

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
    this.editing[rowIndex + "-" + cell] = false;
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
      return d.nombre.toLowerCase().indexOf(val) !== -1 || !val;
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
      .get("assets/data/datatable-data.json")
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
  constructor(
    private http: HttpClient,
    private tecnicosService: TecnicosService,
    private router: Router
  ) {
    this.tempData = [];
    this.multiPurposeTemp = DatatableData;
    setTimeout(() => {
      this.loadingIndicator = false;
    }, 1500);
  }

  //Actions Methods

  verDetalles(Id: string) {
    this.router.navigate([
      "/mantenimientos",
      "tecnicos",
      "Details",
      Id,
    ]);
  }
  editar(Id: string) {
    this.router.navigate([
      "/mantenimientos",
      "tecnicos",
      "Edit",
      Id,
    ]);
  }

  @ViewChild("myDiv") myDiv: ElementRef<HTMLElement>;

  triggerFalseClick() {
    let el: HTMLElement = this.myDiv.nativeElement;
    el.click();
  }

  // eliminar(Id: number) {
  //   alertFunctions.EliminarRegistro("categoriaBeneficiario", Id);

  // }

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit() {
    // Initially load first page
    this.serverSideSetPage({ offset: 0 });

    this.tecnicosService.getTecnicos().subscribe(
      (tecnicosFromTheAPI: any) => {
        this.data = tecnicosFromTheAPI;
        this.rows = this.data;
        this.tempData = this.data;
        this.triggerFalseClick();
      },
      (err: any) => {
        console.error(err);
        this.notFound = true;
      }
    );

    // content header
    this.contentHeader = {
      headerTitle: "Datatables",
      actionButton: true,
      breadcrumb: {
        type: "",
        links: [
          {
            name: "Home",
            isLink: true,
            link: "#",
          },
          {
            name: "Forms & Tables",
            isLink: true,
            link: "",
          },
          {
            name: "Datatables",
            isLink: false,
          },
        ],
      },
    };
  }
}
