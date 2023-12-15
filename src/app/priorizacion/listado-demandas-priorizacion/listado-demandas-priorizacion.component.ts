import { Component, OnInit, ViewEncapsulation, ViewChild, ViewChildren, QueryList, ElementRef } from '@angular/core';
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
import { Observable, of } from 'rxjs';
import { Demanda } from 'app/shared/models/Demandas/Demanda.model';
import { FiltrosDinamicos } from 'app/shared/models/Core/filtros-dinamicos.model';
import { DropDownServiceService } from 'app/shared/services/drop-down-service.service';
import { environment } from 'environments/environment';
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { NgxSpinnerService } from 'ngx-spinner';
import { FormBuilder, Validators } from '@angular/forms';
import { ConsolidationRequest } from 'app/shared/models/Consolidacion/ConsolidationRequest.model';
import { DemandaComentario } from 'app/shared/models/Demandas/DemandaComentario.model';
import { NGXToastrService } from 'app/shared/services/ngxtoastr.service';
import { Console } from 'console';
import { AuthService } from 'app/shared/services/core/auth.service';
import { NivelPrioridadProvincial } from 'app/shared/models/Priorizacion/nivelPrioridadProvincial.enum';
import { IModalOption } from 'app/shared/components/modal/IModalOptions';
import { IModalConfig } from 'app/shared/components/modal/IModalConfig';
import { ModalComponent } from 'app/shared/components/modal/modal.component';
import { DetalleDemandasComponent } from 'app/demandas/detalle-demandas/detalle-demandas.component';

declare var require: any;
const data: any = require('../../shared/data/Demandas.json');

@Component({
  selector: 'app-listado-demandas-priorizacion',
  templateUrl: './listado-demandas-priorizacion.component.html',
  styleUrls: ['./listado-demandas-priorizacion.component.scss', '../../../assets/sass/libs/datatables.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [NGXToastrService]
})
export class ListadoDemandasPriorizacionComponent implements OnInit {

  loadingIndicator: boolean = true;
  reorderable: boolean = true;


  @ViewChild("modalDetalles") modalDetalles: ModalComponent
  @ViewChild("Detalles") Detalles: DetalleDemandasComponent

  modalConfig: IModalConfig = {
    modalTitle: "   "
  }
  modalOption: IModalOption = {
    size: "xl",
    centered: true
  }

  // public
  public contentHeader: object;

  //data:any[];
  notFound = false;
  demandaId: number;
  modal: NgbModal;
  demanda: any;
  listadoContactos: any[] = [];
  gruposUsuario: any;
  listadoPriorizacion: Observable<any>;

  priorizarForm = this.formBuilder.group({
    priorizacion: [null, { validators: [Validators.required] }]
  });

  get PF() {
    return this.priorizarForm.controls;
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
    "provinciaId": null,
    "municipioId": null,
    "temaComunId": null,
    "institucionId": null,
    "estadoId": null,
    "politicaPNPSPId": null,
    "tipoInversionId": null
  }

  // column header
  public columns = [
    //{ name: 'Código', prop: 'codigo', sorteable: false },
    //{ name: 'Año', prop: 'anio', sorteable: false },
    { name: 'Demanda', prop: 'descripcion', sorteable: false, visible: true },
    { name: 'Provincia', prop: 'nombreProvincia', sorteable: false },
    //{ name: 'Institución', prop: 'nombreInstitucionResponsable', sorteable: false },
    //{ name: 'Estado', prop: 'nombreEstadoDemanda', sorteable: false },
    { name: 'Tipo', prop: 'nombreTipoDemanda', sorteable: false },
    { name: 'Prioridad provincial', prop: 'prioridadProvincial', sorteable: false },
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
  constructor(private http: HttpClient, private formBuilder: FormBuilder, private modalService: NgbModal,
    private demandaService: DemandasService,
    private spinner: NgxSpinnerService,
    private serviceStr: NGXToastrService,
    private demandasService: DemandasService,
    private router: Router,
    private dropdownService: DropDownServiceService,
    private authService: AuthService) {
    this.tempData = data;
    this.multiPurposeTemp = DatatableData;
    setTimeout(() => { this.loadingIndicator = false; }, 1500);
  }

  /**
   * On init
   */
  ngOnInit() {

    //listado de TipoDemanda
    let listaNiveles = [];

    for (let item in NivelPrioridadProvincial) {
      if (isNaN(Number(item))) {
        listaNiveles.push({ name: item, id: NivelPrioridadProvincial[item] });
      }
    }
    this.listadoPriorizacion = of(listaNiveles);


    // Initially load first page
    this.pageCallback({ offset: 0 });
    this.filtros = [

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
        name: 'temaComunId',
        label: 'Tema común',
        servicio: this.dropdownService.getTemasComunes(),
        tipo: 'select',
        placeholder: 'Seleccione',
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
        name: 'institucionId',
        label: 'Institución responsable',
        servicio: this.dropdownService.getInstituciones(),
        tipo: 'select',
        placeholder: 'Seleccione',
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
    this.gruposUsuario = this.authService.getGrupos().map(g => g.groupId);
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
      .set('provinciaId', this.filtrosActivos.provinciaId)
      .set('municipioId', this.filtrosActivos.municipioId)
      .set('temaComunId', this.filtrosActivos.temaComunId)
      .set('institucionId', this.filtrosActivos.institucionId)
      .set('estadoDemandaId', this.filtrosActivos.estadoId)
      .set('politicaPNPSPId', this.filtrosActivos.politicaPNPSPId)
      .set('tipoInversionId', this.filtrosActivos.tipoInversionId)
    this.demandasService.getDemandas(params).subscribe((data: any) => {
      // NOTE: the format of the returned data depends on your API!
      this.page.count = data.total;
      this.rows = data.items;
    });
  }

  public async _changeRowLimits(event: any) {
    this.page.limit = this.limitSelected;
    await this.reloadTable();
  }



  submit() {
    this.guardarPriorizacion();

  }

  guardarPriorizacion() {

    const formValue = this.priorizarForm.value;
    this.demanda.prioridadProvincial = formValue.priorizacion;

    this.spinner.show();
    console.log(formValue);
    console.log(this.demanda);

    this.demandasService
      .updateDemanda(this.demanda)
      .toPromise()
      .then((res: any) => {
        this.serviceStr.typeSuccess("la prioridad de la demanda en el nivel provincial se guardo con éxito");
        this.spinner.hide();
        setTimeout(() => {
          window.location.href = "/priorizacion";
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

  openVertically(content, id) {

    this.modalService.open(content, {
      //centered: true,
      //backdrop: "static",
      keyboard: false,
      size: 'xl',
      //windowClass: 'modal-xl'
    });

  }

  openVerticallyCentered(content, id) {

    this.demandaId = id;
    this.Detalles.idExterno = this.demandaId;
    this.Detalles.init();

    this.modalDetalles.open()

  }

  closeModal(){
    this.modalDetalles.close()
  }

}
