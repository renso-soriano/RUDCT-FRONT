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
import { Observable } from 'rxjs';
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

declare var require: any;
const data: any = require('../../shared/data/Demandas.json');

@Component({
  selector: 'app-listado-demandas-consolidacion',
  templateUrl: './listado-demandas-consolidacion.component.html',
  styleUrls: ['./listado-demandas-consolidacion.component.scss', '../../../assets/sass/libs/datatables.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [NGXToastrService]
})
export class ListadoDemandasConsolidacionComponent implements OnInit {

  loadingIndicator: boolean = true;
  reorderable: boolean = true;

  // public
  public contentHeader: object;

  //data:any[];
  notFound = false;
  demandasSelected: number[] = [];
  @ViewChildren("checkboxes") checkboxes: QueryList<ElementRef>;
  modal: NgbModal;
  demanda: any;
  listadoContactos: any[]=[];
  gruposUsuario:any;

  consolidationForm = this.formBuilder.group({
    descripcion: [null, { validators: [Validators.required] }],
    comentario: [null],
    //tipoDemanda: [null, { validators: [Validators.required] }],
    prioridad: [null, { validators: [Validators.required] }],
    contacto: [null],
    nombreCompletoContacto: [null],
    telefonoContacto: [null],
    descripcionContacto: [null]
  });

  get cf() {
    return this.consolidationForm.controls;
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
    "politicaPNPSPId":null
  }

  // column header
  public columns = [
    //{ name: 'Código', prop: 'codigo', sorteable: false },
    { name: 'Año', prop: 'anio', sorteable: false },
    { name: 'Provincia', prop: 'nombreProvincia', sorteable: false },
    { name: 'Institución', prop: 'nombreInstitucionResponsable', sorteable: false },
    { name: 'Tema común', prop: 'nombreTemaComun', sorteable: false },
    { name: 'Estado', prop: 'nombreEstadoDemanda', sorteable: false },
    { name: 'Tipo', prop: 'nombreTipoDemanda', sorteable: false }
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
    private authService: AuthService)
     {
    this.tempData = data;
    this.multiPurposeTemp = DatatableData;
    setTimeout(() => { this.loadingIndicator = false; }, 1500);
  }

  /**
   * On init
   */
  ngOnInit() {
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
    this.demandasService.getDemandas(params).subscribe((data: any) => {
      // NOTE: the format of the returned data depends on your API!
      this.page.count = data.total;
      this.rows = data.items;
      this.checkBoxClear();
      document.body.click();
    });
  }

  public async _changeRowLimits(event: any) {
    this.page.limit = this.limitSelected;
    await this.reloadTable();
  }

  onBotonConsolidarChange(evento: any, tipo: number) {

    if (evento.target.checked) {
      if (this.demandasSelected.findIndex(item => item == tipo) == -1) {
        this.demandasSelected.push(tipo);
      }
    }
    else {
      this.demandasSelected = this.demandasSelected.filter(t => t != tipo);
    }
  }

  checkBoxClear() {

    this.checkboxes.forEach((element) => {
      element.nativeElement.checked = false;
    });

    this.demandasSelected = [];

  }

  //metodo para abrir el modal

  openVerticallyCentered(content, id) {
    this.getDemanda(id);

    this.modalService.open(content, {
      //centered: true,
      //backdrop: "static",
      keyboard: false,
      size: 'xl',
      //windowClass: 'modal-xl'
    });
  }
  openVertically(content) {
    if (this.demandasSelected.length < 2) {
      this.serviceStr.typeError(
        "Debe seleccionar 2 demandas o más para consolidar"
      );
    }
    else {
      this.modalService.open(content, {
        //centered: true,
        //backdrop: "static",
        keyboard: false,
        size: 'xl',
        //windowClass: 'modal-xl'
      });
    }

  }

  getDemanda(demandaId: string) {
    this.notFound = false;
    this.demanda = null;
    this.spinner.show();
    this.demandaService.getDemandaById(demandaId).subscribe(
      (demanda: Demanda) => {
        this.demanda = demanda;
      },
      (err: any) => {
        console.error(err);
        this.notFound = true;
        this.spinner.hide();
      },
      () => {
        this.spinner.hide();
      }
    );
  }

  agregarContacto() {
    if (
      this.cf.nombreCompletoContacto.value != null &&
      this.cf.telefonoContacto.value != null
    ) {
      if (this.listadoContactos == null) {
        this.listadoContactos = [];
      }
      this.listadoContactos.push({
        CodigoDemanda: 0,
        id: 0,
        nombreCompleto: this.cf.nombreCompletoContacto.value,
        telefono: this.cf.telefonoContacto.value,
        descripcion: this.cf.descripcionContacto.value,
        estatus: "A"
      });
    } else {
      this.serviceStr.typeError(
        "No puede añadir Contactos sin nombres y telefonos"
      );
    }

    this.consolidationForm.patchValue({
      nombreCompletoContacto: null,
      telefonoContacto: null,
      descripcionContacto: null,
    });
  }
  eliminarContacto(id: number) {
    this.listadoContactos.splice(id, 1);
  }

  submit() {
    if(this.listadoContactos.length < 1)
    {
      this.serviceStr.typeError(
        "Debe Tener al menos 1 contacto para poder consolidar"
      );
    }
    else{
      this.consolidar();
    }

  }

  consolidar() {

    this.spinner.show();

    let params = new ConsolidationRequest().deserialize({

      ids: this.demandasSelected,
      descripcion: this.cf.descripcion.value,
      prioridad: this.cf.prioridad.value,
      comentarioConsolidacion: this.cf.comentario.value,
      demandaContactos: this.listadoContactos
    });


    this.demandasService
    .consolidarDemandas(params).toPromise()
      .then((res: any) => {
        this.serviceStr.typeSuccess("La demanda se consolidó con éxito");
          this.spinner.hide();
        setTimeout(() => {
          //this.router.navigate(["/consolidacion"]);
          window.location.href = "/consolidacion";
        }, 2000);
      })
      .catch((err) => {
        console.error(err);
        this.serviceStr.typeError(err.error.message);
        this.spinner.hide();
      });




  }


}


