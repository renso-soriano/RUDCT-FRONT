import {
  Component,
  OnInit,
  ViewEncapsulation,
  ViewChild,
  ElementRef,
} from "@angular/core";
import {
  ColumnMode,
  DatatableComponent,
  SelectionType,
} from "@swimlane/ngx-datatable";
import { HttpClient, HttpParams } from "@angular/common/http";
import { map } from "rxjs/operators";
import { Router } from "@angular/router";
import * as alertFunctions from "../../../shared/data/sweet-alerts";
import { DatatableData } from "app/mantenimientos/contacto-institucion/listado-contacto/data/datatables.data";
import { ContactoInsticionalService } from "app/shared/services/mantenimientos/contacto-institucion.service";
import { SSOInstitucionService } from "app/shared/services/mantenimientos/ssoInstituciones.services";
import { ExcelService } from "app/shared/services/excel.service";
import { AuthService } from "app/shared/services/core/auth.service";

@Component({
  selector: 'app-listado-contacto',
  templateUrl: './listado-contacto.component.html',
  styleUrls: ['./listado-contacto.component.scss']
})
export class ListadoContactoComponent implements OnInit {

 loadingIndicator: boolean = true;
  reorderable: boolean = true;

  // public
  public contentHeader: object;
  data: any[];
  notFound = false;

  // row data
  // public rows = data;
  public rows = [];
  dataExcel: any;
  rowExportExcel: any;
  // column header
  public columns = 
  [
  { name: "Nombre", prop: "nombre" },
  { name: "Apellido", prop: "apellido" },
  { name: "Direccion", prop: "direccion" },
  { name: "Funcion", prop: "funcion" },
  { name: "Email", prop: "email" },
  { name: "Extension", prop: "extension" },
  { name: "InstitucionNombre", prop: "institucionNombre" }];


  limitSelect: any = [
    { value: 10, label: "10 Registros por página" },
    { value: 25, label: "25 Registros por página" },
    { value: 50, label: "50 Registros por página" },
    { value: 100, label: "100 Registros por página" }
  ];

  filtrosActivos: any = {
    "Nombre": null,
    "Apellido": null,
    "Telefono": null,
    "Email": null,
    // "Direccion": null,
    "Funcion": null,
    "Extension": null,

  }

  // multi Purpose datatable Row data
  public multiPurposeRows = DatatableData;

  public ColumnMode = ColumnMode;

  @ViewChild(DatatableComponent) table: DatatableComponent;
  @ViewChild("tableRowDetails") tableRowDetails: any;
  @ViewChild("tableResponsive") tableResponsive: any;

  public expanded: any = {};

  public editing = {};
  public date = new Date()
  public chkBoxSelected = [];
  public SelectionType = SelectionType;

  // server side row data
  public serverSideRowData;

  // private
  private tempData = [];
  private multiPurposeTemp = [];
  institucionNombre: string;
  mostrarBoton: boolean = true;
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
   // this.rows = [...this.rows];
  }
  
  limitSelected: any = 10;

  page = {
    limit: this.limitSelected,
    count: 0,
    offset: 0
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
      // Check if at least one element of institucionNombre meets the criteria after converting to lowercase
      return d.institucionNombre.some(function(data) {
        return data.toLowerCase().includes(val);
      });
    });
      
    // update the rows
    this.rows = temp;
    console.log('klk',this.rows)
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
    private contactoInstitucionService: ContactoInsticionalService,
    private router: Router,
    private SSOInstitucionService: SSOInstitucionService,
    private excelService: ExcelService,
    private authService:AuthService

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
      "contactosinstitucionales",
      "Details",
      Id,
    ]);
  }
  editar(Id: string) {
    this.router.navigate([
      "/mantenimientos",
      "contactosinstitucionales",
      "Edit",
      Id,
    ]);
  }

  

  eliminar(id: string) {
    alertFunctions.EliminarRegistro("/mantenimientos/contactosinstitucionales",this.contactoInstitucionService.deleteContactosInstitucion(id));
  }



  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit() {
    // Initially load first page
    this.serverSideSetPage({ offset: 0 });
    let grupousuario = this.authService.getGrupos().map(a => a.groupId);
    this.mostrarBoton = grupousuario.includes(3022);

    this.contactoInstitucionService.getContactosInstitucion().subscribe(
      (contactosFromTheAPI: any) => {
        this.data = contactosFromTheAPI;
        this.rows = this.data;
        this.tempData = this.data;

        // Obtener los nombres de las instituciones y asignarlos a la propiedad institucionNombre
        this.rows.forEach(contacto => {
          this.getinstbyid();
        });
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

  getinstbyid() {
  
    this.SSOInstitucionService.getNombresInstituciones(this.rows.map(a => a.institucionId)).subscribe(
      data => {
        // Assuming data is an array of institution names in the same order as institution IDs
    
        // Update each row's institucionNombre property
        this.rows.forEach((row, index) => {
          row.institucionNombre = data[index];
        });          
    
        // Optionally, you can log the updated rows
        console.log('Updated rows:', this.rows);
      },
      error => {
        console.error(error);
      }
    );
    
  }

  exportexcel() {
    let params;
    params = new HttpParams()
      .set("Page", `${this.page.offset + 1}`)
      .set("Take", `${this.page.limit}`)
      .set("institucionId", 1)


    console.log('row', this.rows);
    

   
    this.contactoInstitucionService.getExportarContactosInstitucionales(params).subscribe(
      (data: any) => {
        this.page.count = data.total;
        this.rowExportExcel = this.rows;  // Usar data.items en lugar de this.rows
        this.preparanDataExcel();  // Llamar a la función sin argumentos
        this.excelService.exportAsExcelFile(this.dataExcel, `Lista de contactos ${this.date}`  );
      },
      (error: any) => {
        console.error(error);
      }
    );

    
  }
  
  
  preparanDataExcel() {
    this.dataExcel = this.rowExportExcel.map((item: any) => {
      const nombreInstitucion = this.rows.find(a => a.institucionId === item.institucionId)?.institucionNombre.toString();
      return {
        //Codigo: item.codigo,
        Nombre: item.nombre,
        Apellido: item.apellido,
        Telefono: item.telefono,
        Email: item.email,
        // Direccion: item.direccion,
        Funcion: item.funcion,
        //institucionId: item.institucionId,  
        Institución: nombreInstitucion,
        // Otras propiedades si es necesario
        // CreadoPor: item.nombreCreadoPor,
        // RegistradoEn: item.fechaRegistro,
        // modificadoPor: item.nombreModificadoPor,
        // ModificadoEn: item.fechaModificacion
      };
      
    });
  
  }
  
  
  
}
