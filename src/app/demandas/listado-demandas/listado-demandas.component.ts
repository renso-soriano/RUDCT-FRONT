import { ExcelService } from "./../../shared/services/excel.service";
import {
  Component,
  OnInit,
  ViewEncapsulation,
  ViewChild,
  ElementRef,
  AfterViewInit,
  TemplateRef,
  AfterContentInit,
  Input,
  Output,
  EventEmitter,
} from "@angular/core";
import { DatatableData } from "./data/datatables.data";
import {
  ColumnMode,
  DatatableComponent,
  SelectionType,
} from "@swimlane/ngx-datatable";
import { HttpClient, HttpParams } from "@angular/common/http";
import { map, tap } from "rxjs/operators";
import { DemandasService } from "app/shared/services/mantenimientos/demandas.service";
import { Router } from "@angular/router";
import * as alertFunctions from "../../shared/data/sweet-alerts";
import { Observable, from } from "rxjs";
import { Demanda } from "app/shared/models/Demandas/Demanda.model";
import { FiltrosDinamicos } from "app/shared/models/Core/filtros-dinamicos.model";
import { DropDownServiceService } from "app/shared/services/drop-down-service.service";
import { environment } from "environments/environment";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { FormBuilder, Validators } from "@angular/forms";
import { NgxSpinnerService } from "ngx-spinner";
import { NGXToastrService } from "app/shared/services/ngxtoastr.service";
import { AuthService } from 'app/shared/services/core/auth.service';
import { saveAs } from 'file-saver';
import * as L from 'leaflet';
import { LeafletMouseEvent } from 'app/shared/utilidades/utilidades';
import { GrupoUsuario } from 'app/shared/models/grupoUsuario.enum';
import { FileManagerService } from '../services/fileManager.service';
import { TipoDocumento } from '../enum/tipo-documento.enum';
import Archivo from '../interface/archivo.interface';
import { RandyFileComponent } from 'app/shared/components/randy-file/randy-file.component';
import { IModalConfig } from 'app/shared/components/modal/IModalConfig';
import { IModalOption } from 'app/shared/components/modal/IModalOptions';
import { ModalComponent } from 'app/shared/components/modal/modal.component';
import { Console } from 'console';
import { RandyFileService } from 'app/shared/services/randy-file/randy-file.service';
import { DemandaAnexos } from 'app/shared/models/Demandas/DemandaAnexos.model';
import { Estados } from 'app/shared/models/auth/estados.enum';
import { EstadosValidacion } from 'app/shared/models/auth/estadosValidacion.enum';
import { DemandaComentario } from 'app/shared/models/Demandas/DemandaComentario.model';
import { DetalleDemandasComponent } from '../detalle-demandas/detalle-demandas.component';
import { EstadoUtilsService } from "app/shared/utilidades/estados-utils";
import { SweetAlertService } from "app/shared/components/sweet-alert/sweet-alert.service";
import { SweetAlert } from "app/shared/components/sweet-alert/sweet-alerts";
import { LowerCasePipe } from "@angular/common";

declare var require: any;
const data: any = require("../../shared/data/Demandas.json");

@Component({
  selector: "app-listado-demandas",
  templateUrl: "./listado-demandas.component.html",
  styleUrls: [
    "./listado-demandas.component.scss",
    "../../../assets/sass/libs/datatables.scss",
  ],
  encapsulation: ViewEncapsulation.None,
  providers: [NGXToastrService],
})
export class ListadoDemandasComponent
  implements OnInit, AfterViewInit, AfterContentInit
{
  URL: string = environment.apiUrl;
  @ViewChild("randyFile", { static: false }) randyFile: RandyFileComponent
  @ViewChild("modalFile") modalAnexo: ModalComponent
  @ViewChild("modalFiles") modalFiles: ModalComponent
  @ViewChild("Detalles") Detalles: DetalleDemandasComponent
  @ViewChild("modalDetalles") modalDetalles: ModalComponent

  loadingIndicator: boolean = true;
  reorderable: boolean = true;
  abierto : boolean;

  modalConfigFiles: IModalConfig = {
    modalTitle: "   ",
  };
  modalOptionFiles: IModalOption = {
    size: "xl",
    centered: true,
  };

  rolesEnum = GrupoUsuario;
  estadoEjecucionEnum = Estados;
  estadoValidacionEnum = EstadosValidacion;

  //Input and Output
  @Output() anexosDemandas = new EventEmitter<any>();
  @Input() listaDeAnexos: Archivo[];
  @Input() isDetail: boolean = false;

  // public
  public contentHeader: object;
  isModalOpen: boolean = false;
  public mouseHoverList: any[] = [];

  //data:any[];
  estadoDemanda: any;
  notFound = false;
  modal: NgbModal;
  @ViewChild("content") content: ElementRef<HTMLElement>;
  //@ViewChild("modalAnexo", {static:false}) modalAnexo: ElementRef<HTMLElement>;
  demanda: Demanda;
  files: any[] = [];
  listadoEstados: Observable<any[]>;
  nuevosAnexos: any[] = [];
  tiposDocumentos: any[] = [
    { name: "Identificacion", index: 1 },
    { name: "Acta De Nacimiento", index: 2 },
    { name: "Documento Prueba", index: 3 },
    { name: "Prueba", index: 4 },
  ];
  tipoDocumentoId: number = 0;
  // private FileURL = 'http://apidemandas.economia.local/Api/File';
  listadoEstadosValidacion: Observable<any[]>;
  institucionUsuarioSSO: number;
  institucionUsuarioEnRUDT: any;
  gruposUsuario: number[] = [];
  usuarioPermisos: any = [""];
  ComentariosList: any[] = [];
  listadoComentarios: any[] = [];
  demandaForEdit: Demanda;
  typeEdit = false;
  pdf: any;
  capas: any;
  UserName?: any;
  rowsFilterByGoups?: any;
  tipoEstado?: string;
  file?: any;
  demandaId?: any;
  listaAnexosId?: any;
  instResponsable: any;
  instEstado: any;

  modalConfig: IModalConfig = {
    modalTitle: "Estado de Demandas",
  };
  modalOption: IModalOption = {
    size: "xl",
    centered: true,
  };

  estadoForm = this.formBuilder.group({
    estado: [null, { validators: [Validators.required] }],
    //comentarioEstado: [null],
    codigoPoa: [null],
    codigoPei: [null],
    codigoSnip: [null],
    //razonDevolucion: [null],
    comentarios: [null],
  });
  get comentarios() {
    return this.estadoForm.get("comentarios");
  }
  get EF() {
    return this.estadoForm.controls;
  }

  estadoChange() {
    console.log("ejecutando el change");
    this.estadoForm.patchValue({
      //comentarioEstado: null,
      codigoPoa: null,
      codigoPei: null,
      codigoSnip: null,
      //razonDevolucion: null
    });
  }

  public idInstitucionProp?: any;

  // row data
  public rows = data;
  limitSelected: any = 10;

  page = {
    limit: this.limitSelected,
    count: 0,
    offset: 0,
  };

  limitSelect: any = [
    { value: 10, label: "10 Registros por página" },
    { value: 25, label: "25 Registros por página" },
    { value: 50, label: "50 Registros por página" },
    { value: 100, label: "100 Registros por página" },
  ];

  public filtros: FiltrosDinamicos[];

  filtrosActivos: any = {
    anio: null,
    //"regionId": null,
    provinciaId: null,
    municipioId: null,
    fuenteDemandaId: null,
    temaCommun: null,
    temaComunId: null,
    institucionId: null,
    ejeEndId: null,
    //"demandaTipoId": null,
    politicaPNPSPId: null,
    estadoId: null,
    tipoInversionId: null,
  };

  // column header
  public columns = [
    { name: "Demanda", prop: "descripcion", sorteable: false, visible: true },
    { name: "Año", prop: "anio", sorteable: false, visible: true },
    {
      name: "Clasificador funcional",
      prop: "nombreTemaComun",
      sorteable: false,
      visible: true,
    },
    {
      name: "Provincia",
      prop: "nombreProvincia",
      sorteable: false,
      visible: true,
    },
    {
      name: "Municipio",
      prop: "nombreMunicipio",
      sorteable: false,
      visible: true,
    },
    { name: "Tipo", prop: "nombreTipoDemanda", sorteable: false },
    // { name: 'Origen', prop: 'nombreFuenteDemanda', sorteable: false },
    // { name: 'Estado de ejecución', prop: 'institucionesInvolucradas' , sorteable: false, visible: true },
    {
      name: "Estado validación",
      prop: "nombreEstadoValidacion",
      sorteable: false,
      visible: true,
    },
  ];

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
  public rowService: Observable<any>;

  // private
  private tempData = [];
  private multiPurposeTemp = [];
  dataExcel: any;
  rowExportExcel: any;
  usuarioInstitucional = false;

  /**
   * filterUpdate
   *
   * @param code
   */
  filterUpdate(event) {
    const val = event.target.value?.toLowerCase();

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

  ngOnDestroy(): void {
    if (this.isModalOpen) {
      this.closeModalSimple();
    }
  }
  public mensaje: string;
  /**
   * Constructor
   *
   * @param {HttpClient} http
   */
  constructor(
    private http: HttpClient,
    private modalService: NgbModal,
    private demandasService: DemandasService,
    private formBuilder: FormBuilder,
    private serviceStr: NGXToastrService,
    private spinner: NgxSpinnerService,
    private authService: AuthService,
    private router: Router,
    private dropdownService: DropDownServiceService,
    private excelService: ExcelService,
    private fileManager: FileManagerService,
    private randyFileService: RandyFileService,
    private estadoUtils: EstadoUtilsService,
    private sweAlert: SweetAlertService
  ) {
    this.tempData = data;
    this.multiPurposeTemp = DatatableData;
    setTimeout(() => {
      this.loadingIndicator = false;
    }, 1500);
    this.mensaje = "Jesus";
  }
  ngAfterContentInit(): void {}
  ngAfterViewInit(): void {}

  openFileModal(demandaId: number): void {
    this.mapFile();
    this.modalAnexo.open();
  }
  //Actions Methods

  verDetalles(CodigoDemanda: string) {
    this.router.navigate(["/demandas", "Details", CodigoDemanda]);
  }
  editar(CodigoDemanda: string) {
    this.router.navigate(["/demandas", "Edit", CodigoDemanda]);
  }
  eliminar(CodigoDemanda: string) {
    alertFunctions.EliminarRegistro(
      "/demandas",
      this.demandasService.deleteDemanda(CodigoDemanda)
    );
  }

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit() {
    this.abierto = false;
    //var usuarioInstitucion = this.authService.getInstitucion();
    const modulo = this.authService?.findModule(
      this.router.routerState.snapshot.url
    );
    this.UserName = this.authService?.getUserCompleteName();

    console.log("Name the  User Login: ", this.UserName);

    this.institucionUsuarioSSO = this.authService?.getInstitucion();
    //  this.institucionUsuarioEnRUDT= this.dropdownService.getInstitucionById(this.institucionUsuarioSSO);
    this.gruposUsuario = this.authService?.getGrupos().map((g) => g.groupId);

    if (this.gruposUsuario?.includes(GrupoUsuario.institucionalRUDT) == true) {
      this.columns = this.columns.filter(
        (x) =>
          x.prop !== "nombreEstadoValidacion" && x.prop !== "nombreTipoDemanda"
      );
      this.columns.push({
        name: "Prioridad provincial",
        prop: "prioridadProvincial",
        sorteable: false,
        visible: true,
      });
      this.columns.push({
        name: "Estado de ejecución",
        prop: "institucionesInvolucradas",
        sorteable: false,
        visible: true,
      });
      this.listadoEstados = this.dropdownService.getEstados();
      this.usuarioInstitucional = true;
      // console.log("Estados: ", this.listadoEstados.subscribe(res => {
      //   res = this.estadoDemanda;
      // }));
      this.tipoEstado = "ejecución";
      //console.log(this.estadoDemanda, 'deandaasssssssssssssssss')
    } else {
      if (this.gruposUsuario.includes(GrupoUsuario.DGDES) == true) {
        this.listadoEstados = this.dropdownService.getEstadosValidacionById(
          GrupoUsuario.DGDES
        );
      }
      if (this.gruposUsuario.includes(GrupoUsuario.VIOTDR) == true) {
        this.listadoEstados = this.dropdownService.getEstadosValidacionById(
          GrupoUsuario.VIOTDR
        );
      }
      if (this.gruposUsuario.includes(GrupoUsuario.regionalesRUDT) == true) {
        this.listadoEstados = this.dropdownService.getEstadosValidacionById(
          GrupoUsuario.regionalesRUDT
        );
      }
      if (
        this.gruposUsuario.includes(GrupoUsuario.administradoresRUDT) == true ||
        this.gruposUsuario.includes(GrupoUsuario.prodecareRUDT) == true
      ) {
        this.listadoEstados = this.dropdownService.getEstadosValidacion();
      }

      this.tipoEstado = "validación";
    }

    this.dropdownService
      ?.getInstitucionById(this.institucionUsuarioSSO)
      .subscribe((x: any) => {
        this.institucionUsuarioEnRUDT = x[0]["id"];
        this.reloadTable();
        console.log(
          "Soy el id de la institucion",
          this.institucionUsuarioEnRUDT
        );
        // console.log(this.listadoEstados,'frev3r3rf3f3f3f3f3f3f3f3r');
      });

    const observable = from(this.authService?.getPermissions(modulo.id));

    observable.subscribe(
      (res: any) => {
        this.usuarioPermisos = res.acciones;
      },
      (err: any) => {
        console.error(err);
      }
    );
    console.log(observable);

    // Initially load first page
    //this.pageCallback({ offset: 0 });
    this.filtros = [
      new FiltrosDinamicos().deserialize({
        name: "anio",
        label: "Año",
        servicio: this.setFilterAnnios(),
        tipo: "select",
        placeholder: "Seleccione un año",
        async: false,
        multiple: false,
      }),
      // new FiltrosDinamicos().deserialize({
      //   name: 'regionId',
      //   label: 'Región',
      //   servicio: this.dropdownService.getRegiones(),
      //   tipo: 'select',
      //   placeholder: 'Seleccione una región',
      //   async: true,
      //   multiple: false,
      //   filtroHijo: 'provinciaId',
      //   servicioHijo: 'getProvinciasByRegion',
      // }),
      new FiltrosDinamicos().deserialize({
        name: "provinciaId",
        label: "Provincia",
        servicio: this.dropdownService.getProvincias(),
        tipo: "select",
        placeholder: "Seleccione una provincia",
        async: true,
        multiple: false,
        filtroHijo: "municipioId",
        servicioHijo: "getMunicipiosByProvincia",
      }),
      new FiltrosDinamicos().deserialize({
        name: "municipioId",
        label: "Municipio",
        servicio: this.dropdownService.getMunicipiosByProvincia(null),
        tipo: "select",
        placeholder: "Seleccione un municipio",
        async: true,
        multiple: false,
      }),
      new FiltrosDinamicos().deserialize({
        name: "fuenteDemandaId",
        label: "Fuente",
        servicio: this.dropdownService.getFuentes(),
        tipo: "select",
        placeholder: "Seleccione una fuente de demanda",
        async: true,
        multiple: false,
      }),
      new FiltrosDinamicos().deserialize({
        name: "temaCommun",
        label: "Tema común",
        servicio: this.dropdownService.getTemasComunes(),
        tipo: "select",
        placeholder: "Seleccione Tema común",
        async: true,
        multiple: false,
        filtroHijo: "temaComunId",
        servicioHijo: "getClasificadorByTemaComun",
      }),
      new FiltrosDinamicos().deserialize({
        name: "temaComunId",
        label: "Clasificador Funcional",
        servicio: this.dropdownService.getClasificadorByTemaComun(null),
        tipo: "select",
        placeholder: "Seleccione un Clasificador funcional",
        async: true,
        multiple: false,
      }),
      new FiltrosDinamicos().deserialize({
        name: "institucionId",
        label: "Institución responsable",
        servicio: this.dropdownService.getInstituciones(),
        tipo: "select",
        placeholder: "Seleccione institución",
        async: true,
        multiple: false,
      }),
      new FiltrosDinamicos().deserialize({
        name: "estadoId",
        label: "Estado",
        servicio: this.dropdownService.getEstados(),
        tipo: "select",
        placeholder: "Seleccione un estado",
        async: true,
        multiple: false,
      }),
      new FiltrosDinamicos().deserialize({
        name: "tipoInversionId",
        label: "Tipo inversion",
        servicio: this.dropdownService.getTipoInversion(),
        tipo: "select",
        placeholder: "Seleccione un tipo",
        async: true,
        multiple: false,
      }),
      new FiltrosDinamicos().deserialize({
        name: "politicaPNPSPId",
        label: "Politica PNPSP",
        servicio: this.dropdownService.getPoliticas(),
        tipo: "select",
        placeholder: "Seleccione politica",
        async: true,
        multiple: false,
      }),
      new FiltrosDinamicos().deserialize({
        name: "ejeEndID",
        label: "Ejes END",
        servicio: this.dropdownService.getEjes(),
        tipo: "select",
        placeholder: "Seleccione eje",
        async: true,
        multiple: false,
      }),
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

  async pageCallback(pageInfo: {
    count?: number;
    pageSize?: number;
    limit?: number;
    offset?: number;
  }) {
    this.page.offset = pageInfo.offset;
    //console.log("reloadTable en pageCallBack")
    await this.reloadTable();
  }

  public informacionInstituciones: any;
  public tool: boolean = false;
  public hoverIndex = -1;
  public tooltikView: boolean = false;
  public rowOnHover: any;
  isHovering = false;

  onHoverRow(row: any) {
    this.rowOnHover = row;
    this.tooltikView = true;
  }

  onHover(i: number) {
    this.hoverIndex = i;
  }

  onMoving(rows: any) {
    const idSelect = rows?.id;
    this.tooltikView = true;
    const resultadoFinal = this.mouseHoverList.find(
      ({ id }) => id === idSelect
    );

    if (resultadoFinal) {
      console.log("A ver:", resultadoFinal);
      const htmlContent = `
       <!--List Group with badges Starts-->
       <div class="col-12 col-md-12 col-lg-12">
         <div class="card">
           <div class="card-content">

             <div class="card-body">
               <ul class="list-group">

               ${resultadoFinal.institucionesInvolucradas.map((item, index) => {
                 return `  <li class="list-group-item">${item.nombreInstitucion}
                   <br/><br/>
                   <span class="badge badge-primary mr-2"> ${item.nombreEstado}</span>
                   </li> `;
               })}
               </ul>
             </div>
           </div>
         </div>
       </div>
`;
      this.tool = true;

      alertFunctions.InstDemanda(htmlContent);
    } else {
      alertFunctions.TypeError(
        "No contiene informacion",
        "Esta demanda no tiene informacion extra!"
      );
    }
  }


  async getFilters(event) {
    this.filtrosActivos = event;
    this.page.offset = 0;
    await this.reloadTable();
  }

  async reloadTable() {
    let params;
    let grupoId;
    let institucion;

    if (this.gruposUsuario.includes(GrupoUsuario.institucionalRUDT) == true) {
      grupoId = GrupoUsuario.institucionalRUDT;
      institucion = this.institucionUsuarioEnRUDT;
    } else if (
      this.gruposUsuario.includes(GrupoUsuario.regionalesRUDT) == true
    ) {
      grupoId = GrupoUsuario.regionalesRUDT;
      institucion = this.filtrosActivos.institucionId;
    } else if (this.gruposUsuario.includes(GrupoUsuario.VIOTDR) == true) {
      grupoId = GrupoUsuario.VIOTDR;
      institucion = this.filtrosActivos.institucionId;
    } else if (this.gruposUsuario.includes(GrupoUsuario.DGDES) == true) {
      grupoId = GrupoUsuario.DGDES;
      institucion = this.filtrosActivos.institucionId;
    } else {
      grupoId = GrupoUsuario.administradoresRUDT;
      institucion = this.filtrosActivos.institucionId;
    }

    params = new HttpParams()
      .set("Page", `${this.page.offset + 1}`)
      .set("Take", `${this.page.limit}`)
      .set("anio", this.filtrosActivos.anio)
      // .set('regionId', this.filtrosActivos.regionId)
      .set("provinciaId", this.filtrosActivos.provinciaId)
      .set("municipioId", this.filtrosActivos.municipioId)
      .set("fuenteDemandaId", this.filtrosActivos.fuenteDemandaId)
      .set("temaCommun", this.filtrosActivos.temaCommun)
      .set("temaComunId", this.filtrosActivos.temaComunId)
      .set("institucionId", institucion)
      .set("tipoInversionId", this.filtrosActivos.tipoInversionId)
      .set("politicaPNPSPId", this.filtrosActivos.politicaPNPSPId)
      .set("estadoDemandaId", this.filtrosActivos.estadoId)
      .set("ejeEndID", this.filtrosActivos.ejeEndID)
      .set("grupoId", grupoId);

    this.demandasService.getDemandas(params).subscribe((data: any) => {
      // NOTE: the format of the returned data depends on your API!
      this.page.count = data.total;
      this.rows = data.items;
      const idRudt = parseInt(this.institucionUsuarioEnRUDT);
      this.idInstitucionProp = idRudt;
      this.mouseHoverList = data.items;
      // console.log("Noel Lista: ",data.items);
      // console.log(exist, 'Coincidencia')
      // let p
      // let filtered
      // let mydata = []
      // data.items?.map(i => {
      //   p = i.institucionesInvolucradas.map((o, i) =>( { index: i, estado: o.estadoId, insti: o.institucionId }))
      //   filtered = p.filter(i => i.insti === +institucion)[0]
      //   mydata.push(filtered)
      // })

      // this.rows = data.items.map((item, i) => ({...item, institucionesInvolucradas: mydata[i]}));
      // console.log(this.rows)
    });
    //console.log(getDemandas(params))
  }

  public async _changeRowLimits(event: any) {
    this.page.limit = this.limitSelected;
    await this.reloadTable();
  }

  exportexcel() {
    //this.spinnerMensaje="Exportando datos...."
    // this.spinner.show();
    let params;
    let grupoId;
    let institucion;

    if (this.gruposUsuario.includes(GrupoUsuario.institucionalRUDT) == true) {
      grupoId = GrupoUsuario.institucionalRUDT;
      institucion = this.institucionUsuarioEnRUDT;
    } else if (
      this.gruposUsuario.includes(GrupoUsuario.regionalesRUDT) == true
    ) {
      grupoId = GrupoUsuario.regionalesRUDT;
      institucion = this.filtrosActivos.institucionId;
    } else if (this.gruposUsuario.includes(GrupoUsuario.VIOTDR) == true) {
      grupoId = GrupoUsuario.VIOTDR;
      institucion = this.filtrosActivos.institucionId;
    } else if (this.gruposUsuario.includes(GrupoUsuario.DGDES) == true) {
      grupoId = GrupoUsuario.DGDES;
      institucion = this.filtrosActivos.institucionId;
    } else {
      grupoId = GrupoUsuario.administradoresRUDT;
      institucion = this.filtrosActivos.institucionId;
    }

    params = new HttpParams()
      .set("Page", `${this.page.offset + 1}`)
      .set("Take", `${this.page.limit}`)
      .set("anio", this.filtrosActivos.anio)
      // .set('regionId', this.filtrosActivos.regionId)
      .set("provinciaId", this.filtrosActivos.provinciaId)
      .set("municipioId", this.filtrosActivos.municipioId)
      .set("fuenteDemandaId", this.filtrosActivos.fuenteDemandaId)
      .set("temaCommun", this.filtrosActivos.temaCommun)
      .set("temaComunId", this.filtrosActivos.temaComunId)
      .set("institucionId", institucion)
      .set("tipoInversionId", this.filtrosActivos.tipoInversionId)
      .set("politicaPNPSPId", this.filtrosActivos.politicaPNPSPId)
      .set("estadoDemandaId", this.filtrosActivos.estadoId)
      .set("ejeEndID", this.filtrosActivos.ejeEndID)
      .set("grupoId", grupoId);

    this.demandasService.getDemandasExportar(params).subscribe((data: any) => {
      this.page.count = data.total;
      this.rowExportExcel = data.items;
      this.preparanDataExcel(this.rowExportExcel);
      //  this.spinner.hide();
      this.excelService.exportAsExcelFile(this.dataExcel, "Lista de demandas");
    });
  }

  institucionesInvolucradasExcel: any = [
    {
      nombre: "",
      estado: 0,
    },
  ];

  preparanDataExcel(data) {
    this.dataExcel = data.map((item: any) => {
      this.institucionesInvolucradasExcel = [];
      item?.institucionesInvolucradas.forEach((i) => {
        this.institucionesInvolucradasExcel.push(
          {
            nombre: i.nombreInstitucion,
            estado: i.estadoId,
            codigoPei:i.codigoPei,
            productoPoa: i.codigoPoa,
            codigoSnip:i.codigoSnip
          }
        )
      })

      const instituciones = this.institucionesInvolucradasExcel.map((inst: any) => {
        const estadoInstitucion = this.estadoUtils.titleEstadoEjecucion(inst.estado);
        return `${inst.nombre} (${estadoInstitucion}) ${inst.codigoSnip != null ? 'Codigo Snip: ' + inst.codigoSnip : ''}
         ${inst.codigoPei != null ? 'Codigo PEI: '+inst.codigoPei : ''} ${inst.productoPoa != null ? 'Producto POA: ' + inst.productoPoa : ''} `;
      });



      console.log(
        "this.institucionesInvolucradasExcel",
        this.institucionesInvolucradasExcel
      );
      console.log("instituciones", instituciones);

      return {
        Codigo: item?.codigo,
        Anio: item?.anio,
        EscalaTerritorial: item?.nivelDemanda,
        Demanda: item?.descripcion,
        EstadoDemanda: this.estadoUtils.titleEstadoEjecucion(
          this.estadoUtils.getEstadoIdForInstitucion(
            item?.institucionesInvolucradas,
            this.idInstitucionProp
          )
        ),
        Prioridad: item?.prioridad,
        Region: item?.nombreRegion,
        Provincia: item?.nombreProvincia,
        Municipio: item?.nombreMunicipio,
        Tema_Comun: item?.temaComunTema,
        Clasificador_Funcional: item?.nombreTemaComun,
        NombreFuenteDemanda: item?.nombreFuenteDemanda,
        institucionesInvolucradas: instituciones.join(","),
        EjeEnd: item?.nombreEjeEnd,
        TecnicoOmpp: item?.nombreTecnicoOmpp,
        ResultanteDe: item?.resultanteDe,
        Activo: item?.estatus ? "Si" : "No",
        // CreadoPor: item.nombreCreadoPor,
        // RegistradoEn: item.fechaRegistro,
        // modificadoPor: item.nombreModificadoPor,
        // ModificadoEn: item.fechaModificacion
      };
    });
  }
  mapFile() {
    //  let file = this.listaDeAnexos;
    this.demanda.demandaAnexos.forEach((item: any) => {
      this.files.push({
        file: {
          ...item?.file,
        },
        tipoDocumentoId: item.file.fileType.id.toString(),
        id: item.id,
        entityId: item?.demandaId,
      });
    });
  }
  removeFile(fileId) {
    const index = this.demanda.demandaAnexos.findIndex((x) => x.id === fileId);
    this.demanda.demandaAnexos.splice(index, 1);
  }

  openModalComentario(contentComentario) {
    this.modalService.open(contentComentario, {
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
  }

  setListasDemandas(demanda: Demanda): void {
    this.ComentariosList = demanda.demandaComentarios?.map((item: any) => {
      return {
        id: item?.id,
        demandaId: item?.demandaId,
        comentrio: item?.comentrio,
        estatus: item?.estatus,
        userName: item?.userName,
      };
    });
  }

  agregarComentario() {
    console.log("A verL ", this.comentarios.value);
    if (this.comentarios.value != null && this.comentarios.value.trim() != "") {
      if (this.ComentariosList == null) {
        this.ComentariosList = [];
      }
      this.ComentariosList.push({
        id: 0,
        demandaId: this.typeEdit ? this.demandaForEdit.id : 0,
        comentrio: this.comentarios.value,
        estatus: "A",
        userName: this.UserName,
      });
      console.log("A verL ", this.ComentariosList);
    } else {
      this.serviceStr.typeError("No puede añadir comentarios vacíos");
    }

    this.estadoForm.patchValue({
      comentarios: null,
    });
  }

  async verArchivos(demandaId) {
    await this.http
      .get<Observable<any>>(
        `${this.URL}DemandaAnexo/GetDocumentByDemandaId/${demandaId}`
      )
      .toPromise()
      .then((res: any) => {
        console.log("Noel files GEEEET: ", res);
        this.mapFiles(res);
        console.log("Noel files Despues: ", res);
      });

    // this.router.navigate(["/demandas", 'Archivos', CodigoDemanda]);
  }

  openModalFile() {
    this.modalFiles.open();
  }

  private mapFiles(res: any) {
    let array = [];
    res.result?.forEach((item) => {
      array.push({
        id: item?.id,
        file: { ...item.file },
        tipoDocumentoId: item.file.fileType.id.toString(),
        entityId: item.demandaId,
        estadoAnexo: item.estadoAnexo,
        fileId: item.fileId,
      });
    });
    this.files = array;
    this.openModalFile();
    console.log("files QUE HAY?:", this.files);
  }

  openVerticallyCentered(content, id: any) {
    this.isModalOpen = true;
    this.EF.estado.setValue(null);
    this.files = []; //aca se inicializa siempre en 0, asi se evita que se repita
    this.demandasService.getDemandaById(id).subscribe(
      (demanda: Demanda) => {
        this.demanda = demanda;
        //this.estadoDemanda = demanda.institucionesInvolucradas.map((e)=>e.nombreEstado);
        this.ComentariosList = demanda?.demandaComentarios;
        console.log("Lista de comentarios: ", this.ComentariosList);
        console.log("Lista de otras cosas: ", this.demanda);
        if (this.usuarioInstitucional) {
          this.demanda.institucionesInvolucradas.forEach((institucion) => {
            const idRudt = parseInt(this.institucionUsuarioEnRUDT);

            if (institucion.institucionId === idRudt) {
              const estadoName = this.estadoUtils.titleEstadoEjecucion(
                institucion?.estadoId
              );
              this.estadoDemanda = estadoName;

              this.estadoForm.patchValue({
                estado: institucion.estadoId?.toString(),
                //comentarioEstado: this.demanda?.comentarioEstado,
                codigoSnip: institucion?.codigoSnip,
                codigoPoa: institucion?.codigoPoa,
                codigoPei: institucion?.codigoPei,
                //razonDevolucion: this.demanda?.razonDevolucion
              });
            }
          });
        } else {
          this.estadoForm.patchValue({
            estado: this.demanda.estadoValidacionId?.toString(),
          });
        }

        if (this.demanda.demandaAnexos.length == 0) {
          this.isDetail = false;
        }
        // this.listaDeAnexos = demanda.demandaAnexos
        this.mapFile();
        // console.log("Lista de Anexos", this.files);
      },
      (err: any) => {
        console.error(err);
        this.notFound = true;
      },
      () => {}
    );
    this.demandaId = id;
    this.modalAnexo.open();
    // this.modalService.open(content, {
    //   centered: true,
    //   backdrop: "static",
    //   keyboard: false,
    //   size: "xl"
    // });
  }

  getEstadoIdForInstitucion(
    institucionesInvolucradas?: any[],
    idInstitucion?: number
  ): number | null {
    const institucionInvolucrada = institucionesInvolucradas.find(
      (institucion) => institucion.institucionId === idInstitucion
    );
    return institucionInvolucrada ? institucionInvolucrada.estadoId : null;
  }

  titleEstadoEjecucion(id?: number): string {
    switch (id) {
      case Estados.pendienteAsignarSectorial:
        return "Pendiente Asignar Sectorial";
      case Estados.asignadoASectorial:
        return "Asignado A Sectorial";
      case Estados.reasignacionSectorial:
        return "Reasignacion Sectorial";
      case Estados.enProcesoDeEjecucion:
        return "En Proceso De Ejecucion";
      case Estados.incluidoEnPEI:
        return "Incluido En PEI";
      case Estados.programadoEnPOA:
        return "Programado En POA";
      case Estados.noInciada:
        return "No Iniciada";
      case Estados.ejecutado:
        return "Ejecutado";
      default:
        return "";
    }
  }

  getEstadoClass(estadoId: number): { [className: string]: boolean } {
    return {
      "bg-danger": estadoId === 3,
      "bg-warning": estadoId === 2,
      "bg-info": estadoId === 5,
      "bg-primary": estadoId === 4,
      "bg-secondary": estadoId === 1,
      "bg-success": estadoId === 6,
      "bg-dark": estadoId === 7,
    };
  }

  closeModalSimple() {
    this.isModalOpen = false;
    this.modalAnexo.close();
  }

  closeModal() {
    this.submit();
    this.isModalOpen = false;
    this.modalAnexo.close();
  }
  submit() {
    //validaciones finales de listados
    // if (this.EF.estado.value == this.estadoEjecucionEnum.reasignacionSectorial && this.gruposUsuario.includes(GrupoUsuario.institucionalRUDT) ) {
    //   this.serviceStr.typeError(
    //     "Debe completar el por qué rechaza la demanda"
    //   );
    // }else
    if (
      this.EF.estado.value == this.estadoEjecucionEnum.enProcesoDeEjecucion &&
      this.gruposUsuario.includes(GrupoUsuario.institucionalRUDT) &&
      this.EF.codigoSnip.value == null
    ) {
      this.serviceStr.typeError("Debe introducir el codigo snip del proyecto");
    } else if (
      this.EF.estado.value == this.estadoEjecucionEnum.incluidoEnPEI &&
      this.gruposUsuario.includes(GrupoUsuario.institucionalRUDT) &&
      this.EF.codigoPei.value == null
    ) {
      this.serviceStr.typeError("Debe introducir el codigo PEI");
    } else if (
      this.EF.estado.value == this.estadoEjecucionEnum.programadoEnPOA &&
      this.gruposUsuario.includes(GrupoUsuario.institucionalRUDT) &&
      this.EF.codigoPoa.value == null
    ) {
      this.serviceStr.typeError("Debe introducir el nombre del producto POA");
    } else {
      this.enviar();
    }
  }

  async enviar() {
    const formValue = this.estadoForm.value;

    if (this.gruposUsuario.includes(GrupoUsuario.institucionalRUDT) == true) {
      const nuevoEstadoId = parseInt(formValue.estado, 10);
      const idRudt = parseInt(this?.institucionUsuarioEnRUDT);

      this.demanda.institucionesInvolucradas.forEach((institucion) => {
        if (institucion.institucionId === idRudt) {
          institucion.estadoId = nuevoEstadoId;
        }
      });
    } else {
      this.demanda.estadoValidacionId = parseInt(formValue.estado, 10);
    }

    let files = this.randyFile?.getFiles();
    if (files?.length > 0) {
      let formData = this.randyFileService.createFormData(files);
      let fileIds = await this.randyFileService
        .uploadFiles(formData)
        .toPromise();
      fileIds.forEach((fileId) => {
        this.demanda.demandaAnexos.push({
          demandaId: this.demanda.id,
          fileId,
          id: 0,
        });
      });
    }

    this.demanda.demandaComentarios = this.ComentariosList;

    this.demanda.institucionesInvolucradas.forEach((institucion) => {
      const idRudt = parseInt(this.institucionUsuarioEnRUDT);

      if (institucion.institucionId === idRudt) {
        institucion.codigoPei = formValue.codigoPei;
        institucion.codigoPoa = formValue.codigoPoa;
        institucion.codigoSnip = formValue.codigoSnip;

        console.log(formValue.codigoSnip, "codigo snip");
      }
    });
    //this.demanda.comentarioEstado = formValue.comentarioEstado;
    //this.demanda.razonDevolucion = formValue.razonDevolucion;

    this.spinner.show();
    this.demandasService
      .updateDemanda(this.demanda)
      .toPromise()
      .then((res: any) => {
        this.serviceStr.typeSuccess(
          "El estado de la demanda se actualizó con éxito"
        );
        this.spinner.hide();
        setTimeout(() => {
          window.location.href = "/demandas";
        }, 1500);
      })
      .catch((err) => {
        console.error("Que sucede? ", err);
        this.serviceStr.typeError(
          "Ocurrió un error inesperado al actualizar la demanda, contacte con Soporte TIC"
        );
        this.spinner.hide();
      });
  }

  //para el mapa

  options = {
    layers: [
      L.tileLayer(
        "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
        {
          minZoom: 8,
          maxZoom: 18,
          attribution: "...",
          id: "mapbox/streets-v11",
          tileSize: 512,
          zoomOffset: -1,
          accessToken: environment.mapbox.accessToken,
        }
      ),
    ],
    zoom: 8,
    center: L.latLng(
      environment.InicializarMapa.coordenadaX,
      environment.InicializarMapa.coordenadaY
    ),
  };

  //#region  Sección Mapa
  SeleccioneMapa(content) {
    this.isModalOpen = true;
    this.modalService.open(content, { size: "lg", centered: true });
    this.options;
    this.BuscarMap(this.rows);
  }

  BuscarMap(data): void {
    this.capas = [];

    for (var i = 0; i < data.length; i++) {
      let provincia = [data[i]?.nombreProvincia];
      let municipio = [data[i]?.nombreMunicipio];
      let latitud = Number([data[i]?.coordenadaX]);
      let longitud = Number([data[i]?.coordenadaY]);
      let demanda = [data[i]?.descripcion];
      let fuente = [data[i]?.nombreFuenteDemanda];
      let institucionResponsable = [data[i]?.nombreInstitucionResponsable];
      let clasificadorFuncional = [data[i]?.nombreTemaComun];
      let anio = [data[i]?.anio];
      let estado = [data[i]?.nombreEstadoDemanda];

      this.capas.push(
        L.marker([latitud, longitud], {
          icon: L.icon({
            iconSize: [25, 41],
            iconAnchor: [13, 41],
            iconUrl: "assets/mapa/marker-icon.png",
            shadowUrl: "assets/mapa/marker-shadow.png",
          }),
        }).bindPopup(
          `
      <strong>Provincia:</strong> ${provincia} <br/>
      <strong>Municipio:</strong> ${municipio} <br/>
      <strong>Demanda:</strong> ${demanda} <br/>
      <strong>Institucion responsable:</strong> ${institucionResponsable} <br/>
      <strong>Año:</strong> ${anio} <br/>
      <strong>Estado:</strong> ${estado} <br/>
      <strong>Fuente:</strong> ${fuente} <br/>
      <strong>Clasificador Funcional:</strong> ${clasificadorFuncional} <br/>`,
          {
            closeOnClick: true,
            closeButton: false,
            autoClose: true,
            autoPan: true,
          }
        )
      );
    }
  }

  // openSubirEvidencia(modalAnexo){
  //   this.modalService.open(modalAnexo, {
  //   centered: true,
  //   backdrop: "static",
  //   keyboard: false,
  //   size: "xl",
  // });
  // }

  getFile(event: any) {
    this.file = event.target.files[0];
  }

  saveFiles(obs: Observable<any[]>) {
    obs.subscribe((res) => {
      //creando el objeto que guardara la relacion
      //entre archivos y demanda
      var lista = res.map((id) => {
        return {
          id: 0,
          FileId: id,
          demandaId: this.demandaId,
        };
      });

      console.log("Lista nueva:", lista);
      // this.demandasService.saveDemandaAnexo(lista)
      //   .subscribe(res => {
      //     console.log(res);
      //   });
    });
  }

  openVerticallyCentered2(content, id) {

    this.demandaId = id;
    this.Detalles.idExterno = this.demandaId;
    this.Detalles.init();

    this.modalDetalles.open()

  }

  closeModal2(){
    this.modalDetalles.close()
  }



}
