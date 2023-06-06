import { ExcelService } from './../../shared/services/excel.service';
import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef, AfterViewInit, TemplateRef, AfterContentInit } from '@angular/core';
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
import { Observable, from } from 'rxjs';
import { Demanda } from 'app/shared/models/Demandas/Demanda.model';
import { FiltrosDinamicos } from 'app/shared/models/Core/filtros-dinamicos.model';
import { DropDownServiceService } from 'app/shared/services/drop-down-service.service';
import { environment } from 'environments/environment';
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { FormBuilder, Validators } from '@angular/forms';
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


declare var require: any;
const data: any = require('../../shared/data/Demandas.json');

@Component({
  selector: 'app-listado-demandas',
  templateUrl: './listado-demandas.component.html',
  styleUrls: ['./listado-demandas.component.scss', '../../../assets/sass/libs/datatables.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [NGXToastrService],
})
export class ListadoDemandasComponent implements OnInit, AfterViewInit, AfterContentInit{

  @ViewChild("randyFile") randyFile:RandyFileComponent
  @ViewChild("modalAnexo") modalAnexo:ModalComponent
  loadingIndicator: boolean = true;
  reorderable: boolean = true;

  // public
  public contentHeader: object;

  //data:any[];
  notFound = false;
  modal: NgbModal;
  @ViewChild("content") content: ElementRef<HTMLElement>;
  //@ViewChild("modalAnexo", {static:false}) modalAnexo: ElementRef<HTMLElement>;
  demanda: Demanda;
  listadoEstados: Observable<any[]>;
  tiposDocumentos: any[] = [
    {name: 'Identificacion' ,index: 1},
    {name: 'Acta De Nacimiento' ,index: 2},
    {name: 'Documento Prueba' ,index:3},
    {name: 'Prueba' ,index: 4}];
  tipoDocumentoId: number = 0
    // private FileURL = 'http://apidemandas.economia.local/Api/File';
  listadoEstadosValidacion: Observable<any[]>;
  institucionUsuarioSSO: number;
  institucionUsuarioEnRUDT: any;
  gruposUsuario: number[] = [];
  usuarioPermisos: any = [''];
  pdf: any;
  capas: any;
  rowsFilterByGoups: any;
  tipoEstado: string;
  file: any
  demandaId: any
  listaAnexosId: any
  modalConfig: IModalConfig = {
    modalTitle: "Anexos de Demandas"
  }
  modalOption: IModalOption ={
    size: "xl",
    centered: true
  }


  estadoForm = this.formBuilder.group({
    estado: [null, { validators: [Validators.required] }],
    comentarioEstado: [null],
    codigoPoa: [null],
    codigoPei: [null],
    codigoSnip: [null],
    razonDevolucion: [null]
  });

  get EF() {
    return this.estadoForm.controls;
  }

  estadoChange() {
    this.estadoForm.patchValue({
      comentarioEstado: null,
      codigoPoa: null,
      codigoPei: null,
      codigoSnip: null,
      razonDevolucion: null
    });
  }


  // row data
  public rows = data;
  limitSelected: any = 10;

  page = {
    limit: this.limitSelected,
    count: 0,
    offset: 0
  }

  limitSelect: any = [
    { value: 10, label: "10 Registros por página" },
    { value: 25, label: "25 Registros por página" },
    { value: 50, label: "50 Registros por página" },
    { value: 100, label: "100 Registros por página" }
  ];

  public filtros: FiltrosDinamicos[];

  filtrosActivos: any = {
    "anio": null,
    //"regionId": null,
    "provinciaId": null,
    "municipioId": null,
    "fuenteDemandaId": null,
    "temaCommun": null,
    "temaComunId": null,
    "institucionId": null,
    //"demandaTipoId": null,
    "politicaPNPSPId": null,
    "estadoId": null,
    "tipoInversionId": null,
  }

  // column header
  public columns = [
    { name: 'Demanda', prop: 'descripcion', sorteable: false, visible: true },
    { name: 'Año', prop: 'anio', sorteable: false, visible: true },
    { name: 'Clasificador funcional', prop: 'nombreTemaComun', sorteable: false, visible: true },
    { name: 'Provincia', prop: 'nombreProvincia', sorteable: false, visible: true },
    { name: 'Municipio', prop: 'nombreMunicipio', sorteable: false, visible: true },
    // { name: 'Origen', prop: 'nombreFuenteDemanda', sorteable: false },
    { name: 'Estado de ejecución', prop: 'nombreEstadoDemanda', sorteable: false, visible: false },
    { name: 'Estado validación', prop: 'nombreEstadoValidacion', sorteable: false, visible: true },
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
  dataExcel: any;
  rowExportExcel: any;

  openFileModal(demandaId:number):void{
    console.log(demandaId, "Demanda ID NOEL")
  this.modalAnexo.open();
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
   * Constructor
   *
   * @param {HttpClient} http
   */
  constructor(private http: HttpClient,
    private modalService: NgbModal,
    private demandasService: DemandasService,
    private formBuilder: FormBuilder,
    private serviceStr: NGXToastrService,
    private spinner: NgxSpinnerService,
    private authService: AuthService,
    private router: Router,
    private dropdownService: DropDownServiceService,
    private excelService: ExcelService,
    private fileManager: FileManagerService
    ) {
    this.tempData = data;
    this.multiPurposeTemp = DatatableData;
    setTimeout(() => { this.loadingIndicator = false; }, 1500);
  }
  ngAfterContentInit(): void {

  }
  ngAfterViewInit(): void {
    console.log(this.randyFile, "AQUI RANDY FILE REF");
    console.log(this.modalAnexo, "AQUI ng-template REF");
  }

  //Actions Methods

  verDetalles(CodigoDemanda: string) {
    this.router.navigate(["/demandas", 'Details', CodigoDemanda]);
  }
  editar(CodigoDemanda: string) {
    this.router.navigate(["/demandas", 'Edit', CodigoDemanda]);
  }
  eliminar(CodigoDemanda: string) {
    alertFunctions.EliminarRegistro("/demandas", this.demandasService.deleteDemanda(CodigoDemanda));

  }

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit() {
    //var usuarioInstitucion = this.authService.getInstitucion();
    const modulo = this.authService.findModule(this.router.routerState.snapshot.url);

    this.institucionUsuarioSSO = this.authService.getInstitucion();
    this.gruposUsuario = this.authService.getGrupos().map(g => g.groupId);

    if (this.gruposUsuario.includes(GrupoUsuario.institucionalRUDT) == true) {
      this.columns = this.columns.filter(x => x.prop !== 'nombreEstadoValidacion');
      this.listadoEstados = this.dropdownService.getEstados();
      this.tipoEstado = "ejecución";
    }
    else {
       if (this.gruposUsuario.includes(GrupoUsuario.DGDES) == true)
       {
        this.listadoEstados = this.dropdownService.getEstadosValidacionById(GrupoUsuario.DGDES);
       }
       if (this.gruposUsuario.includes(GrupoUsuario.VIOTDR) == true)
       {
        this.listadoEstados = this.dropdownService.getEstadosValidacionById(GrupoUsuario.VIOTDR);
       }
       if (this.gruposUsuario.includes(GrupoUsuario.regionalesRUDT) == true)
       {
        this.listadoEstados = this.dropdownService.getEstadosValidacionById(GrupoUsuario.regionalesRUDT);
       }
       if (this.gruposUsuario.includes(GrupoUsuario.administradoresRUDT) == true || this.gruposUsuario.includes(GrupoUsuario.prodecareRUDT) == true)
       {
        this.listadoEstados = this.dropdownService.getEstadosValidacion();
       }

      this.tipoEstado = "validación";
    }


    this.dropdownService.getInstitucionById(this.institucionUsuarioSSO).subscribe((x: any) => {
      this.institucionUsuarioEnRUDT = x[0]['id'];
      this.reloadTable();

    });

    const observable = from(this.authService.getPermissions(modulo.id));


    observable.subscribe((res: any) => {
      this.usuarioPermisos = res.acciones;


    }, (err: any) => {
      console.error(err);
    });




    // Initially load first page
    //this.pageCallback({ offset: 0 });
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
        name: 'provinciaId',
        label: 'Provincia',
        servicio: this.dropdownService.getProvincias(),
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
      new FiltrosDinamicos().deserialize({
        name: 'temaCommun',
        label: 'Tema común',
        servicio: this.dropdownService.getTemasComunes(),
        tipo: 'select',
        placeholder: 'Seleccione Tema común',
        async: true,
        multiple: false,
        filtroHijo: 'temaComunId',
        servicioHijo: 'getClasificadorByTemaComun',
      }),
      new FiltrosDinamicos().deserialize({
        name: 'temaComunId',
        label: 'Clasificador Funcional',
        servicio: this.dropdownService.getClasificadorByTemaComun(null),
        tipo: 'select',
        placeholder: 'Seleccione un Clasificador funcional',
        async: true,
        multiple: false,

      }),

      new FiltrosDinamicos().deserialize({
        name: 'institucionId',
        label: 'Institución responsable',
        servicio: this.dropdownService.getInstituciones(),
        tipo: 'select',
        placeholder: 'Seleccione institución',
        async: true,
        multiple: false
      }),
      new FiltrosDinamicos().deserialize({
        name: 'estadoId',
        label: 'Estado',
        servicio: this.dropdownService.getEstados(),
        tipo: 'select',
        placeholder: 'Seleccione un estado',
        async: true,
        multiple: false
      }),
      new FiltrosDinamicos().deserialize({
        name: 'tipoInversionId',
        label: 'Tipo inversion',
        servicio: this.dropdownService.getTipoInversion(),
        tipo: 'select',
        placeholder: 'Seleccione un tipo',
        async: true,
        multiple: false
      }),
      new FiltrosDinamicos().deserialize({
        name: 'politicaPNPSPId',
        label: 'Politica PNPSP',
        servicio: this.dropdownService.getPoliticas(),
        tipo: 'select',
        placeholder: 'Seleccione politica',
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
    //console.log("reloadTable en pageCallBack")
    await this.reloadTable();
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
    } else if (this.gruposUsuario.includes(GrupoUsuario.regionalesRUDT) == true) {
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
      .set('Page', `${this.page.offset + 1}`)
      .set('Take', `${this.page.limit}`)
      .set('anio', this.filtrosActivos.anio)
      // .set('regionId', this.filtrosActivos.regionId)
      .set('provinciaId', this.filtrosActivos.provinciaId)
      .set('municipioId', this.filtrosActivos.municipioId)
      .set('fuenteDemandaId', this.filtrosActivos.fuenteDemandaId)
      .set('temaCommun', this.filtrosActivos.temaCommun)
      .set('temaComunId', this.filtrosActivos.temaComunId)
      .set('institucionId', institucion)
      .set('tipoInversionId', this.filtrosActivos.tipoInversionId)
      .set('politicaPNPSPId', this.filtrosActivos.politicaPNPSPId)
      .set('estadoDemandaId', this.filtrosActivos.estadoId)
      .set('grupoId', grupoId);

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

  exportexcel() {
    //this.spinnerMensaje="Exportando datos...."
    // this.spinner.show();
    let params;
    let grupoId;
    let institucion;

    if (this.gruposUsuario.includes(GrupoUsuario.institucionalRUDT) == true) {
      grupoId = GrupoUsuario.institucionalRUDT;
      institucion = this.institucionUsuarioEnRUDT;
    } else if (this.gruposUsuario.includes(GrupoUsuario.regionalesRUDT) == true) {
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
      .set('Page', `${this.page.offset + 1}`)
      .set('Take', `${this.page.limit}`)
      .set('anio', this.filtrosActivos.anio)
      // .set('regionId', this.filtrosActivos.regionId)
      .set('provinciaId', this.filtrosActivos.provinciaId)
      .set('municipioId', this.filtrosActivos.municipioId)
      .set('fuenteDemandaId', this.filtrosActivos.fuenteDemandaId)
      .set('temaCommun', this.filtrosActivos.temaCommun)
      .set('temaComunId', this.filtrosActivos.temaComunId)
      .set('institucionId', institucion)
      .set('tipoInversionId', this.filtrosActivos.tipoInversionId)
      .set('politicaPNPSPId', this.filtrosActivos.politicaPNPSPId)
      .set('estadoDemandaId', this.filtrosActivos.estadoId)
      .set('grupoId', grupoId);

    this.demandasService.getDemandasExportar(params).subscribe((data: any) => {
      this.page.count = data.total;
      this.rowExportExcel = data.items;
      console.log("rowsExcel=>", this.rowExportExcel);
      this.preparanDataExcel(this.rowExportExcel);
      //  this.spinner.hide();
      this.excelService.exportAsExcelFile(this.dataExcel, 'Lista de demandas');

    });


  }

  preparanDataExcel(data) {
    this.dataExcel = data.map((item: any) => {
      return {
        Codigo: item.codigo,
        Anio: item.anio,
        EscalaTerritorial: item.nivelDemanda,
        Demanda: item.descripcion,
        EstadoDemanda: item.nombreEstadoDemanda,
        Prioridad: item.prioridad,
        Region: item.nombreRegion,
        Provincia: item.nombreProvincia,
        Municipio: item.nombreMunicipio,
        Tema_Comun: item.temaComunTema,
        Clasificador_Funcional: item.nombreTemaComun,
        NombreFuenteDemanda: item.nombreFuenteDemanda,
        InstitucionResponsable: item.nombreInstitucionResponsable,
        TecnicoOmpp: item.nombreTecnicoOmpp,
        ResultanteDe: item.resultanteDe,
        Activo: item.estatus ? "Si" : "No"
        // CreadoPor: item.nombreCreadoPor,
        // RegistradoEn: item.fechaRegistro,
        // modificadoPor: item.nombreModificadoPor,
        // ModificadoEn: item.fechaModificacion

      };

    });


  }


  openVerticallyCentered(content, id: any) {
    this.EF.estado.setValue(null);
    this.demandasService.getDemandaById(id).subscribe(
      (demanda: Demanda) => {
        this.demanda = demanda;
      },
      (err: any) => {
        console.error(err);
        this.notFound = true;
        document.body.click();
      },
      () => {
        document.body.click();
      }
    );
    this.demandaId = id;
    this.modalService.open(content, {
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
  }

  submit() {

    //validaciones finales de listados
    if (this.EF.estado.value == 3 && this.gruposUsuario.includes(GrupoUsuario.institucionalRUDT) == true && this.EF.comentarioEstado.value == null) {
      this.serviceStr.typeError(
        "Debe completar el por qué rechaza la demanda"
      );
    }
    else if (this.EF.estado.value == 4 && this.gruposUsuario.includes(GrupoUsuario.institucionalRUDT) == true && this.EF.codigoSnip.value == null) {
      this.serviceStr.typeError(
        "Debe introducir el codigo snip del proyecto"
      );
    }
    else if (this.EF.estado.value == 5 && this.gruposUsuario.includes(GrupoUsuario.institucionalRUDT) == true && this.EF.codigoPei.value == null) {
      this.serviceStr.typeError(
        "Debe introducir el codigo PEI"
      );
    }
    else if (this.EF.estado.value == 6 && this.EF.codigoPoa.value == null) {
      this.serviceStr.typeError(
        "Debe introducir el codigo POA"
      );
    }
    else {
      this.enviar();
    }
  }

  enviar() {

    const formValue = this.estadoForm.value;

    if (this.gruposUsuario.includes(GrupoUsuario.institucionalRUDT) == true) {
      this.demanda.estadoId = parseInt(formValue.estado, 10);
    }
    else {
      this.demanda.estadoValidacionId = parseInt(formValue.estado, 10);
    }

    this.demanda.codigoPei = formValue.codigoPei;
    this.demanda.codigoPoa = formValue.codigoPoa;
    this.demanda.codigoSnip = formValue.codigoSnip;
    this.demanda.comentarioEstado = formValue.comentarioEstado;
    this.demanda.razonDevolucion = formValue.razonDevolucion;

    this.spinner.show();
    console.log(formValue);
    console.log(this.demanda);

    this.demandasService
      .updateDemanda(this.demanda)
      .toPromise()
      .then((res: any) => {
        this.serviceStr.typeSuccess("El estado de la demanda se actualizó con éxito");
        this.spinner.hide();
        setTimeout(() => {
          window.location.href = "/demandas";
        }, 1500);
      })
      .catch((err) => {
        console.error(err);
        this.serviceStr.typeError(
          "Ocurrió un error inesperado al actualizar la demanda, contacte con Soporte TIC"
        );
        this.spinner.hide();
      });

  }

  //para el mapa


  options = {
    layers: [
      L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        minZoom: 8,
        maxZoom: 18,
        attribution: '...',
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: environment.mapbox.accessToken,
      }),
    ],
    zoom: 8,
    center: L.latLng(environment.InicializarMapa.coordenadaX, environment.InicializarMapa.coordenadaY)

  };

  //#region  Sección Mapa
  SeleccioneMapa(content) {
    this.modalService.open(content, { size: 'lg', centered: true });
    this.options;
    this.BuscarMap(this.rows);

  }

  BuscarMap(data): void {
    this.capas = [];

    for (var i = 0; i < data.length; i++) {
      let provincia = [data[i].nombreProvincia]
      let municipio = [data[i].nombreMunicipio]
      let latitud = Number([data[i].coordenadaX])
      let longitud = Number([data[i].coordenadaY])
      let demanda = [data[i].descripcion]
      let fuente = [data[i].nombreFuenteDemanda]
      let institucionResponsable = [data[i].nombreInstitucionResponsable]
      let clasificadorFuncional = [data[i].nombreTemaComun]
      let anio = [data[i].anio]
      let estado = [data[i].nombreEstadoDemanda]

      this.capas.push(
        L.marker([latitud, longitud], {
          icon: L.icon({
            iconSize: [25, 41],
            iconAnchor: [13, 41],
            iconUrl: 'assets/mapa/marker-icon.png',
            shadowUrl: 'assets/mapa/marker-shadow.png',
          })
        }).bindPopup(`
      <strong>Provincia:</strong> ${provincia} <br/>
      <strong>Municipio:</strong> ${municipio} <br/>
      <strong>Demanda:</strong> ${demanda} <br/>
      <strong>Institucion responsable:</strong> ${institucionResponsable} <br/>
      <strong>Año:</strong> ${anio} <br/>
      <strong>Estado:</strong> ${estado} <br/>
      <strong>Fuente:</strong> ${fuente} <br/>
      <strong>Clasificador Funcional:</strong> ${clasificadorFuncional} <br/>`,
          { closeOnClick: true, closeButton: false, autoClose: true, autoPan: true })

      );

    }
  }

  openSubirEvidencia(modalAnexo){
    this.modalService.open(modalAnexo, {
    centered: true,
    backdrop: "static",
    keyboard: false,
    size: "xl",
  });
}

getFile(event: any){
  this.file = event.target.files[0]
  console.log('Archivo seleccionado: ', this.file)
}

saveFiles(obs:Observable<number[]>){
  obs.subscribe((res)=>{
    console.log(res,"amores van y vienen");

    //creando el objeto que guardara la relacion
    //entre archivos y demanda
    var lista = res.map(id => {
      return {
        id: 0,
        FileId: id,
        demandaId: this.demandaId
      };
    });

    console.log(lista, "la lista de demandaAnexo");

    this.demandasService.saveDemandaAnexo(lista)
      .subscribe(res => {
        console.log(res);
      });

  });
}

submitData(){

  // const files: Archivo[] = [
  //   {
  //     id: 0,
  //     entityId: this.demanda.id,
  //     file: this.file,
  //     tipoDocumentoId: this.tipoDocumentoId
  //   }
  // ]
  console.log(this.modalAnexo, "ref" );
  // let files = this.randyFile.getFiles();
  // console.log(files);

  // let data = this.fileManager.createFormData(files);
  // console.log(data.,"DATA");
  // data.forEach(value=>{
  //   console.log(value,"VALUE");
  // })

  // this.fileManager.uploadFiles(data).subscribe(res => {
  //   console.log(res);
  // })
}

// onFileSelected(event) {

//   const file:File = event.target.files[0];
//   console.log('Documento ID', this.tipoDocumentoId)
//   if (file) {

//       // this.fileName = file.name;

//       const files: Archivo[] = [
//         {
//           id: 0,
//           entityId: this.demanda.id,
//           file,
//           tipoDocumentoId: this.tipoDocumentoId
//         }
//       ]

//       let convertToFormBase = this.fileManager.createFormData(files)

//       console.log("BAAAAAAAAASE", convertToFormBase);
//   let result = this.fileManager.convertBase64ToBlob(file);
//    console.log("fileeeeeeeeee", file);
//    console.log("Resuuuuuut", result);

//       const upload$ = this.fileManager.uploadFiles(formData);

//       upload$.subscribe(x => {
//         console.log("que haces?",x)
//       });
//   }
// }

// uploader = Uploader({
//   apiKey: "free"
// });

// options1: UploadWidgetConfig = {
//   multi: false

// };

// onUpdate = (files: UploadWidgetResult[]) => {
//   alert(files.map(x => x.fileUrl).join("\n"));
// };

// width = "400px";
//   height = "275px";





  //manejarClick(event:LeafletMouseEvent) {

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
  //}


}
