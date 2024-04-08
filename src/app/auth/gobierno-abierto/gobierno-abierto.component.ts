

import { Component, ViewChild, OnInit, ViewEncapsulation, ElementRef, AfterViewChecked } from '@angular/core';
import { ItemMenu } from 'app/shared/models/auth/ItemMenu';
import { ExcelService } from './../../shared/services/excel.service';
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
import { RegionChartComponent } from 'app/shared/components/region-chart/region-chart.component';
import { MapaComponent } from 'app/shared/components/mapa/mapa.component';
import { MapSettings } from 'app/shared/models/Core/MapSettings.model';
import { DashboardResponse } from 'app/shared/models/auth/gobierno-abierto.model';
import { Estados } from 'app/shared/models/auth/estados.enum'
import { EjeEnd } from 'app/shared/models/ejeEnd.enum';
import { DetalleDemandasComponent } from 'app/demandas/detalle-demandas/detalle-demandas.component';
import { IModalConfig } from 'app/shared/components/modal/IModalConfig';
import { IModalOption } from 'app/shared/components/modal/IModalOptions';
import { ModalComponent } from 'app/shared/components/modal/modal.component';
import { RandyFileComponent } from 'app/shared/components/randy-file/randy-file.component';
import { DemandaAnexos } from 'app/shared/models/Demandas/DemandaAnexos.model';
declare var require: any;
const data: any = require('../../shared/data/Demandas.json');

@Component({
  selector: 'app-gobierno-abierto',
  templateUrl: './gobierno-abierto.component.html',
  styleUrls: ['./gobierno-abierto.component.scss', '../../../assets/sass/libs/datatables.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [NGXToastrService]
})
export class GobiernoAbiertoComponent implements OnInit {

  //RANDY:
  URL: string = environment.apiUrl;
  @ViewChild("modalFiles") modalfiles: ModalComponent
  @ViewChild("randyFile") randyFile: RandyFileComponent
  files: any[] = []
  abierto = true;

  activeModules = []

  public isCollapsed = true;
  public documentpath: any

  @ViewChild('regionChart') regionChart: RegionChartComponent;
  @ViewChild('mapaComponent') mapaComponent: MapaComponent;

  @ViewChild("modalDetalles") modalDetalles: ModalComponent
  @ViewChild("Detalles") Detalles: DetalleDemandasComponent

  modalConfig: IModalConfig = {
    modalTitle: "   "
  }
  modalOption: IModalOption = {
    size: "xl",
    centered: true
  }
  modalConfigFiles: IModalConfig = {
    modalTitle: "   "
  }
  modalOptionFiles: IModalOption = {
    size: "xl",
    centered: true
  }

  mapSettings: MapSettings = {
    servicio: null,
    BindProperty: 'demandasPorProvincia',
    BindValue: 'totalDemandas',
    GeoDataFile: 'do_provincias',
    Label: 'Provincia'
  }

  demandaId: number;

  dashboard: DashboardResponse;

  ejeSocial;
  ejeEconomico;
  ejeInstitucional;
  ejeMedioAmbiental;
  estadosEnum: Estados
  newsizeMap: number;

  menuItems: ItemMenu[] = [
    {
      id: 1,
      titulo: "Soy un ciudadano",
      subTitulo: "",
      ruta: "/auth/gobierno_abierto",
      imagePath: "../../../../../assets/img/svg/organismos.svg"

    },
    {
      id: 2,
      titulo: "Soy usuario RUDCT",
      subTitulo: "",
      ruta: "/auth/login",
      imagePath: "../../../../../assets/img/svg/negociacion.svg"

    },

  ]

  visitCounter: number[];

  navegar(item: ItemMenu) {
    if (this.activeModules.includes(item.id)) {
      this.router.navigate([`${item.ruta}`])
    }
  }

  //from Datatable

  loadingIndicator: boolean = true;
  reorderable: boolean = true;

  // public
  public contentHeader: object;

  //data:any[];
  notFound = false;
  modal: NgbModal;
  @ViewChild("content") content: ElementRef<HTMLElement>;
  demanda: Demanda;
  listadoEstados: Observable<any[]>;
  listadoEstadosValidacion: Observable<any[]>;
  institucionUsuarioSSO: number;
  institucionUsuarioEnRUDT: any;
  gruposUsuario: number[] = [];
  usuarioPermisos: any = [''];
  pdf: any;
  capas: any;
  rowsFilterByGoups: any;
  tipoEstado: string;

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
    //"fuenteDemandaId": null,
    // "temaCommun": null,
    //"temaComunId": null,
    "institucionId": null,
    //"demandaTipoId": null,
    // "politicaPNPSPId": null,
    //"estadoId": null,
    "tipoInversionId": null,
  }

  // column header
  public columns = [
    { name: 'Demanda', prop: 'descripcion', sorteable: false, visible: true },
    { name: 'Año', prop: 'anio', sorteable: false, visible: true },
    // { name: 'Clasificador funcional', prop: 'nombreTemaComun', sorteable: false, visible: true },
    { name: 'Provincia', prop: 'nombreProvincia', sorteable: false, visible: true },
    { name: 'Municipio', prop: 'nombreMunicipio', sorteable: false, visible: true },
    //{ name: 'Institución Responsable', prop: 'nombreInstitucionResponsable', sorteable: false, visible: true },
    // { name: 'Origen', prop: 'nombreFuenteDemanda', sorteable: false },
    //{ name: 'Estado de ejecución', prop: 'nombreEstadoDemanda', sorteable: false, visible: false },
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
    private excelService: ExcelService) {

      this.newsizeMap = window.innerHeight; // toma el tamaño de la anchura
      window.addEventListener('resize', () => {
        this.newsizeMap = window.innerWidth;
      });

    this.tempData = data;
    this.multiPurposeTemp = DatatableData;
    setTimeout(() => { this.loadingIndicator = false; }, 1500);
  }


  //Actions Methods

  verDetalles(CodigoDemanda: string) {
    this.router.navigate(["/demandas", 'Details', CodigoDemanda]);
  }


  async verArchivos(demandaId) {
    await this.http.get<Observable<any>>(`${this.URL}DemandaAnexo/GetDocumentByDemandaId/${demandaId}`).toPromise()
      .then((res: any) => {
        this.mapFiles(res)
        console.log("Lista de fileees: ", res)
      })

    // this.router.navigate(["/demandas", 'Archivos', CodigoDemanda]);
  }
  openModalFile() {
    this.modalfiles.open();
  }
  validarFalse(data:any){
    return data.some(x => x.estadoAnexo == true)
  }
  private mapFiles(res: any) {
    let array = [];
    res.result?.forEach((item) => {
      if(item.estadoAnexo == true)
      {
        array.push({
          file: { ...item.file },
          tipoDocumentoId: item.file.fileType.id.toString(),
          entityId: item.demandaId,
          institucionNombre: item.institucionNombre
        })
      }


    });
    this.files = array;
    this.openModalFile()
    console.log(this.files, "files");
  }



  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit() {
    this.activeModules = [1, 2];
    this.tipoEstado = "ejecución";
    var nuevaUrl = this.URL.replace(/\/api\//i, "/");
    this.documentpath = `${nuevaUrl}files/VERSIÓN FINAL - Instructivo RUDCT Soy un Ciudadano.pdf`
    this.reloadTable();

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
      /* new FiltrosDinamicos().deserialize({
        name: 'fuenteDemandaId',
        label: 'Fuente',
        servicio: this.dropdownService.getFuentes(),
        tipo: 'select',
        placeholder: 'Seleccione una fuente de demanda',
        async: true,
        multiple: false
      }), */
      /* new FiltrosDinamicos().deserialize({
        name: 'temaCommun',
        label: 'Tema común',
        servicio: this.dropdownService.getTemasComunes(),
        tipo: 'select',
        placeholder: 'Seleccione Tema común',
        async: true,
        multiple: false,
        filtroHijo: 'temaComunId',
        servicioHijo: 'getClasificadorByTemaComun',
      }), */
      /*  new FiltrosDinamicos().deserialize({
         name: 'temaComunId',
         label: 'Clasificador Funcional',
         servicio: this.dropdownService.getClasificadorByTemaComun(null),
         tipo: 'select',
         placeholder: 'Seleccione un Clasificador funcional',
         async: true,
         multiple: false,

       }), */

      new FiltrosDinamicos().deserialize({
        name: 'institucionId',
        label: 'Institución responsable',
        servicio: this.dropdownService.getInstituciones(),
        tipo: 'select',
        placeholder: 'Seleccione institución',
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
        name: 'tipoInversionId',
        label: 'Tipo inversion',
        servicio: this.dropdownService.getTipoInversion(),
        tipo: 'select',
        placeholder: 'Seleccione un tipo',
        async: true,
        multiple: false
      })/* ,
      new FiltrosDinamicos().deserialize({
        name: 'politicaPNPSPId',
        label: 'Politica PNPSP',
        servicio: this.dropdownService.getPoliticas(),
        tipo: 'select',
        placeholder: 'Seleccione politica',
        async: true,
        multiple: false
      }) */
    ];
    this.loadingIndicator = false;


  }

  ngAfterViewInit(): void {
    this.CheckUserVisit()  
}
 openfile(){
  

}
CheckUserVisit() {
  const hasVisitedBefore = localStorage.getItem('visited');

  if (!hasVisitedBefore) {
    this.fetchCounterAndUpdateLocalStorage();
  }

  if(hasVisitedBefore){
    this.handleVisitedUser();
  } 
}

fetchCounterAndUpdateLocalStorage() {
  this.http.get<number>(`${this.URL}Contador`)
    .subscribe((res: number) => {
      const storedCounter = res.toString().split('').map(Number);
      localStorage.setItem('visited', 'true');
      this.visitCounter = storedCounter;
    });
}

handleVisitedUser() {
  const currentDateTime = new Date();
  let storedExpirationTime = localStorage.getItem('expiration');

    const expirationTime = storedExpirationTime ?
    new Date(parseInt(storedExpirationTime, 10)) :
    new Date(currentDateTime.getTime() + 2 * 60 * 60 * 1000); // 2 horas


  localStorage.setItem('expiration', expirationTime.getTime().toString());
  

  if (currentDateTime > expirationTime) {
    this.fetchCounterAndUpdateLocalStorage();

    const newExpirationTime = new Date(currentDateTime.getTime() + 2 * 60 * 60 *1000);
    localStorage.setItem('expiration', newExpirationTime.getTime().toString());
  }

  if (storedExpirationTime) {
    const storedExpirationDateTime = new Date(parseInt(storedExpirationTime, 10));

    if (currentDateTime > storedExpirationDateTime) {
      localStorage.removeItem('expiration');
      storedExpirationTime = null;
    }
  }

  if(currentDateTime < expirationTime)
  this.http.get<number>(`${this.URL}Contador/GetContadorNoIncremento`)
      .subscribe((res: number) => {
        this.visitCounter = res.toString().split('').map(Number);
  });
  console.log('Número de visitas:', this.visitCounter);

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
    grupoId = GrupoUsuario.administradoresRUDT;
    institucion = this.filtrosActivos.institucionId;

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

    this.mapSettings.servicio = this.demandasService.getDemandasForDashboardAbierto(params);
    this.mapSettings.servicio.subscribe(res => {
      this.dashboard = res

      this.page.count = res['data']['total'];
      this.rows = res['data']['items'];

      this.recargaMapa();
      this.regionChart.regionesInfo = this.dashboard.demandasPorRegion;
      this.regionChart.initAll(this.dashboard.demandasPorRegion)

      this.ejeInstitucional = this.dashboard.demandasPorEje.find((demanda: any) => demanda.ejeId == EjeEnd.Institucionalidad)?.cantidad ?? 0;
      this.ejeSocial = this.dashboard.demandasPorEje.find((demanda: any) => demanda.ejeId == EjeEnd.Social)?.cantidad ?? 0;
      this.ejeEconomico = this.dashboard.demandasPorEje.find((demanda: any) => demanda.ejeId == EjeEnd.Economico)?.cantidad ?? 0;
      this.ejeMedioAmbiental = this.dashboard.demandasPorEje.find((demanda: any) => demanda.ejeId == EjeEnd.MedioAmbiental)?.cantidad ?? 0;

    }, () => { }
      , () => {

      });

  }

  public async _changeRowLimits(event: any) {

    this.page.limit = this.limitSelected;
    await this.reloadTable();
  }

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

  exportexcel() {
    //this.spinnerMensaje="Exportando datos...."
    // this.spinner.show();
    let params;
    let grupoId;
    let institucion;

    grupoId = GrupoUsuario.administradoresRUDT;
    institucion = this.filtrosActivos.institucionId;


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

    this.demandasService.getDemandasExportarGobiernoAbierto(params).subscribe((data: any) => {
      this.page.count = data.total;
      this.rowExportExcel = data.items;
      this.preparanDataExcel(this.rowExportExcel);
      //  this.spinner.hide();
      this.excelService.exportAsExcelFile(this.dataExcel, 'Lista de demandas');

    });


  }

  preparanDataExcel(data) {
    this.dataExcel = data.map((item: any) => {
      return {
        Codigo: item.codigo,
        Año: item.anio,
        Escala_Territorial: item.nivelDemanda,
        Demanda: item.descripcion,
        Estado_Demanda: item.nombreEstadoDemanda,
        Prioridad: item.prioridad,
        Region: item.nombreRegion,
        Provincia: item.nombreProvincia,
        Municipio: item.nombreMunicipio,
        Tema_Comun: item.temaComunTema,
        Clasificador_Funcional: item.nombreTemaComun,
        Nombre_Fuente_Demanda: item.nombreFuenteDemanda,
        Institucion_Responsable: item.nombreInstitucionResponsable.join('\n'),
        Tecnico_Ompp: item.nombreTecnicoOmpp,
        Resultante_De: item.resultanteDe,
        Activo: item.estatus ? "Si" : "No"
        // CreadoPor: item.nombreCreadoPor,
        // RegistradoEn: item.fechaRegistro,
        // modificadoPor: item.nombreModificadoPor,
        // ModificadoEn: item.fechaModificacion

      };

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
    zoomControl: true,
    zoomSnap: 0.25,
    zoomDelta: 0.5,
    zoom: 8.30,
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


  get regiones() {
    return this.dashboard?.demandasPorRegion ?? []
  }

  openVerticallyCentered(content, id) {

    this.demandaId = id;
    this.Detalles.idExterno = this.demandaId;
    this.Detalles.init();

    this.modalDetalles.open()

  }

  closeModal() {
    this.modalDetalles.close()
  }

  referenciaMapa: string = 'provincias';

  //deleted lines
  changeMap(event: any) {

    switch (event.target.value) {
      case '1':
        this.mapSettings.GeoDataFile = 'do_provincias';
        this.mapSettings.BindProperty = 'demandasPorProvincia';
        this.mapSettings.BindValue = 'totalDemandas';
        this.mapSettings.Label = 'Provincia';
        this.referenciaMapa = 'Provincias';
        //this.mapSettings.servicio = this.demandasService.getDemandasForDashboardAbierto();
        break;

      case '2':
        this.mapSettings.GeoDataFile = 'do_municipios';
        //this.mapSettings.GeoDataFile = 'MUNICIPIOS';
        this.mapSettings.BindProperty = 'demandasPorMunicipio';
        this.mapSettings.BindValue = 'totalDemandas';
        this.mapSettings.Label = 'Municipio';
        this.referenciaMapa = 'Municipios';
        //this.mapSettings.servicio = this.demandasService.getDemandasForDashboardAbierto();
        break;
      default:
        break;
    }
    this.recargaMapa();
  }

  //deleted lines

  recargaMapa() {
    this.BuscarMap(this.rows);
    this.mapaComponent.onReload(this.mapSettings);
  }

}
