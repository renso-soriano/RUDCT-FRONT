import { NivelDemanda } from "../../shared/models/nivelDemanda.enum";
import { TipoInversion } from "./../../shared/models/Mantenimientos/TipoInversion.model";
import {
  Component,
  ElementRef,
  Inject,
  NgModuleFactoryLoader,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from "@angular/core";
import { FormBuilder, Validators, FormArray, FormGroup } from "@angular/forms";
import { DropDownServiceService } from "app/shared/services/drop-down-service.service";
import { NgSelectModule, NgOption } from "@ng-select/ng-select";
import { Observable, of } from "rxjs";
import { map } from "rxjs/operators";
import { NGXToastrService } from "app/shared/services/ngxtoastr.service";
import { IejeEnd } from "app/shared/models/ieje-end";
import { ItipoInversion } from "app/shared/models/iTipoInversion";
import { ItipoBeneficiario } from "app/shared/models/iTipoBeneficiario";
import { DemandasService } from "app/shared/services/mantenimientos/demandas.service";
import { ActivatedRoute, Router } from "@angular/router";
import { DropdownResponse } from "app/shared/models/Core/DropdownResponse.model";
import { Demanda } from "app/shared/models/Demandas/Demanda.model";
import { DemandaActividad } from "app/shared/models/Demandas/DemandaActividad.model";
import { DemandaComentario } from "app/shared/models/Demandas/DemandaComentario.model";
import { NgxSpinnerService } from "ngx-spinner";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { NgTemplateOutlet } from "@angular/common";
import { $ } from "protractor";
import { TemaComunService } from "app/shared/services/mantenimientos/tema-comun.service";
import { environment } from "environments/environment";
import * as L from 'leaflet';
import { LeafletMouseEvent } from "app/shared/utilidades/utilidades";
import { HttpParams } from "@angular/common/http";

@Component({
  selector: "app-registro-demandas-form",
  templateUrl: "./registro-demandas-form.component.html",
  // encapsulation: ViewEncapsulation.None,
  styleUrls: ["./registro-demandas-form.component.scss"],
  providers: [NGXToastrService],
})
export class RegistroDemandasFormComponent implements OnInit {
  constructor(
    private formBuilder: FormBuilder,
    private dropDownService: DropDownServiceService,
    private demandaService: DemandasService,
    private route: ActivatedRoute,
    private router: Router,
    private spinner: NgxSpinnerService,
    private serviceStr: NGXToastrService,
    private modalService: NgbModal,
    private temaComunService: TemaComunService,
  ) { }

  //Lleno todos los dropdowns fijos en el inicio
  ngOnInit() {
    this.llenarDropDownFijos();

    this.route.paramMap.subscribe((params) => {
      if (params.has("id")) {
        this.demandaId = params.get("id");
        this.getDemandaParaEditar(params.get("id"));
        this.typeEdit = true;
      } else {
        this.demandaForEdit = new Demanda();
        let miBotonModal = document.getElementById("miBoton");
        miBotonModal.click();
      }
    });
    this.mode = this.typeEdit ? "Editar" : "Registro de";
  }

  private _demanda: Demanda;
  private demandaId: string;

  modal: NgbModal;

  @ViewChild("content") content: ElementRef<HTMLElement>;

  //propiedades
  codigoDemanda: number = 0;
  anios: any;
  regiones: Observable<any[]>;
  provincias: Observable<any[]>;
  municipios: Observable<any[]>;
  distritosMunicipales: Observable<any[]>;
  fuenteDemandas: Observable<any[]>;
  ejesEnd: Observable<any[]>;
  objetivosEnd: Observable<any[]>;
  instituciones: Observable<any[]>;
  politicas: Observable<any[]>;
  tecnicos: Observable<any[]>;
  tipoInversiones: Observable<any[]>;
  listadoNivelDemandas: Observable<any[]>;
  listadoTemaComun: Observable<any[]>;
  listadoTemaComunFinalidad: Observable<any[]>;
  listadoTemaComunFuncion: Observable<any[]>;

  listadoPoliticas: any[] = [];
  listadoObjetivos: any[] = [];
  listadoInstituciones: any[] = [];
  listadoActividades: any[] = [];
  listadoEjes: any[];
  listadoInversion: any[];
  listadoComentarios: any[] = [];
  InversionesSelected: any[] = [];
  listadoTipoBeneficiarios: Observable<any[]>;
  listadoCategoriaBeneficiarios: Observable<any[]>;
  listadoBeneficiarios: any[] = [];
  beneficiariosSelected: any[] = [];
  listadoContactos: any[] = [];
  capas: any[];

  activCount = 0;
  notFound = false;
  otrosTiposShow = false;
  mode: string;
  typeEdit = false;
  demandaForEdit: any;
  formGroup: FormGroup;

  registerForm = this.formBuilder.group({
    anio: [null, { validators: [Validators.required] }],
    region: [null, { validators: [Validators.required] }],
    provincia: [null, { validators: [Validators.required] }],
    municipio: [null],
    distrito: [],
    fuente: [null, { validators: [Validators.required] }],
    eje: [null],
    objetivo: [null],
    demanda: [
      "",
      {
        validators: [Validators.required, Validators.minLength(15)],
      },
    ],
    tecnico: [null],
    institucionResponsable: [null, { validators: [Validators.required] }],
    institucionesColaboradoras: [],
    comentarios: [null],
    actividad: [null],
    politica: [],
    tiposInversion: [null, { validators: [Validators.required] }],
    otrosTiposInversion: [""],
    inversionchkBox: [null],
    tipo: [null],
    categoria: [null],
    cantidad: [null],
    beneficiarios: [null],
    nivelDemanda: [null, { validators: [Validators.required] }],
    contacto: [null],
    nombreCompletoContacto: [null],
    telefonoContacto: [null],
    descripcionContacto: [null],
    finalidad: [null],
    funcion: [null],
    temaComunId: [null, { validators: [Validators.required] }],
    prioridad: [null, { validators: [Validators.required] }],
    demandaTipoId: [1],
    coordenadaX: [null],
    coordenadaY: [null],
    consolidadaEn: [null],
    codigoSisplan: [null],
    codigoSnip: [null],
    codigoPoa: [null],
    codigoPei: [null],
    justificacionRechazo: [null]

  });

  //getters
  get comentarios() {
    return this.registerForm.get("comentarios");
  }
  get prioridad() {
    return this.registerForm.get("prioridad");
  }
  get temaComunId() {
    return this.registerForm.get("temaComunId");
  }
  get password() {
    return this.registerForm.get("password");
  }
  get demanda() {
    return this.registerForm.get("demanda");
  }
  get politica() {
    return this.registerForm.get("politica");
  }
  get institucionResponsable() {
    return this.registerForm.get("institucionResponsable");
  }
  get institucionesColaboradoras() {
    return this.registerForm.get("institucionesColaboradoras");
  }
  get actividad() {
    return this.registerForm.get("actividad");
  }
  get region() {
    return this.registerForm.get("region");
  }

  get provincia() {
    return this.registerForm.get("provincia");
  }
  get municipio() {
    return this.registerForm.get("municipio");
  }
  get distrito() {
    return this.registerForm.get("distrito");
  }
  get fuente() {
    return this.registerForm.get("fuente");
  }
  get eje() {
    return this.registerForm.get("eje");
  }
  get objetivo() {
    return this.registerForm.get("objetivo");
  }
  get tecnico() {
    return this.registerForm.get("tecnico");
  }
  get contacto() {
    return this.registerForm.get("contacto");
  }
  get anio() {
    return this.registerForm.get("anio");
  }
  get otrosTiposInversion() {
    return this.registerForm.get("otrosTiposInversion");
  }
  get tipo() {
    return this.registerForm.get("tipo");
  }
  get categoria() {
    return this.registerForm.get("categoria");
  }
  get coordenadaX() {
    return this.registerForm.get("coordenadaX");
  }
  get coordenadaY() {
    return this.registerForm.get("coordenadaY");
  }
  get consolidadaEn() {
    return this.registerForm.get("consolidadaEn");
  }
  get codigoSisplan() {
    return this.registerForm.get("codigoSisplan");
  }
  get codigoSnip() {
    return this.registerForm.get("codigoSnip");
  }
  get codigoPoa() {
    return this.registerForm.get("codigoPoa");
  }
  get codigoPei() {
    return this.registerForm.get("codigoPei");
  }
  get justificacionRechazo() {
    return this.registerForm.get("justificacionRechazo");
  }

  get cantidad() {
    return this.registerForm.get("cantidad");
  }
  get beneficiarios() {
    return this.registerForm.get("beneficiarios");
  }
  get tiposInversion() {
    return this.registerForm.get("tiposInversion");
  }

  get nivelDemanda() {
    return this.registerForm.get("nivelDemanda");
  }
  get nombreCompletoContacto() {
    return this.registerForm.get("nombreCompletoContacto");
  }
  get telefonoContacto() {
    return this.registerForm.get("telefonoContacto");
  }
  get descripcionContacto() {
    return this.registerForm.get("descripcionContacto");
  }
  get finalidad() {
    return this.registerForm.get("finalidad");
  }
  get funcion() {
    return this.registerForm.get("funcion");
  }

  // rellena DropDowns.
  llenarDropDownFijos(): void {
    // llena el año
    this.anios = this.dropDownService.getAños();

    // llena La region
    this.regiones = this.dropDownService.getRegiones();

    // llena La Fuente
    this.fuenteDemandas = this.dropDownService.getFuentes();

    // llena ejeEnd
    this.ejesEnd = this.dropDownService.getEjes();

    // llena Instituciones Responsables
    this.instituciones = this.dropDownService.getInstituciones();

    // llena Politicas
    this.politicas = this.dropDownService.getPoliticas();

    //tipoInversion
    this.dropDownService.getTipoInversion().subscribe(
      (inversionesFromTheAPI: DropdownResponse[]) => {
        this.listadoInversion = inversionesFromTheAPI;
        // this.unCheck();
      },
      (err: any) => {
        console.error(err);
        this.notFound = true;
      }
    );

    //tipoInversion observable
    this.tipoInversiones = this.dropDownService.getTipoInversion();

    //tipoBeneficiario
    this.listadoTipoBeneficiarios = this.dropDownService.getTipoBeneficiarios();

    //categoriaBeneficiario
    this.listadoCategoriaBeneficiarios =
      this.dropDownService.getCategoriasBeneficiarios();

    //listado de TipoDemanda
    let listaNiveles = [];

    for (let item in NivelDemanda) {
      if (isNaN(Number(item))) {
        listaNiveles.push({ text: item, value: NivelDemanda[item] });
      }
    }
    this.listadoNivelDemandas = of(listaNiveles);

    // listado de temas comunes

    let params = new HttpParams()
      .set('param', `finalidad`)
      .set('content', `noImporta`);

    this.listadoTemaComunFinalidad = this.temaComunService.getTemaComunByParam(params);




  } // fin llenarDropDownFijos

  //Metodos eventos change

  // llena Las provincias de acuerdo a la region
  onRegionChange(id: number): void {
    this.provincias = this.dropDownService.getProvinciasByRegion(id);
    this.municipios = null;
    this.distritosMunicipales = null;
    this.registerForm.patchValue({
      provincia: null,
      municipio: null,
      distrito: null,
    });
  }

  setProvinciaDropdown(regionId: number, provinciaId?: number) {
    this.onRegionChange(regionId);
    return provinciaId == null ? null : provinciaId.toString();
  }

  setMunicipioDropdown(provinciaId: number, municipioId?: number) {
    this.onProvinciaChange(provinciaId);
    return municipioId == null ? null : municipioId.toString();
  }

  setDistritoDropdown(municipioId: number, distritoid?: number) {
    this.onMunicipiosChange(municipioId);
    return distritoid == null ? null : distritoid.toString();
  }

  setOtrasInversiones(tipoInversiones: any[]) {
    let otroTipo = tipoInversiones.find((item) => item.tipoInversionId == 8);
    if (otroTipo != null) {
      this.otrosTiposShow = true;
      return otroTipo.tipoInversionOtros;
    }
    return null;
  }

  // llena Los municipios de acuerdo a la provincia
  onProvinciaChange(id: number): void {
    this.municipios = this.dropDownService.getMunicipiosByProvincia(id);
    this.distritosMunicipales = null;
    this.registerForm.patchValue({
      municipio: null,
      distrito: null,
    });
  }

  // llena Los distritos de acuerdo a los municipios
  onMunicipiosChange(id: number): void {
    this.distritosMunicipales =
      this.dropDownService.getDistritosByMunicipio(id);
    this.distrito.setValue(null);

    // llena Tecnicos
    this.tecnicos = this.dropDownService.getTecnicos(id);
    this.tecnico.setValue(null);
  }

  // llena Los objetivos de acuerdo a los ejes
  onEjeChange(id: number): void {
    this.objetivosEnd = this.dropDownService.getObjetivosByEjeId(id);
    this.objetivo.setValue(null);
  }
  //end dropDowns

  //****************************otros metodos******************************* */

  getDemandaParaEditar(CodigoDemanda: string) {
    this.notFound = false;
    this.demandaForEdit = null;
    this.spinner.show();
    this.demandaService.getDemandaById(CodigoDemanda).subscribe(
      (demanda: Demanda) => {
        this.demandaForEdit = demanda;
        this.setListasDemandas(demanda);
        this.registerForm.patchValue({
          anio: demanda.anio,
          region: demanda.regionId.toString(),
          provincia: this.setProvinciaDropdown(
            demanda.regionId,
            demanda.provinciaId
          ),
          municipio: this.setMunicipioDropdown(
            demanda.provinciaId,
            demanda.municipioId
          ),
          distrito: this.setDistritoDropdown(
            demanda.municipioId,
            demanda.distritoMunicipalId
          ),
          temaComunId: demanda.temaComunId,
          finalidad: demanda.finalidadTemaComun,
          funcion: demanda.funcionTemaComun,
          fuente: demanda.fuenteDemandaId.toString(),
          eje: [],
          objetivo: [],
          demanda: demanda.descripcion,
          tecnico: demanda.tecnicoOMPPId != null ? demanda.tecnicoOMPPId.toString() : null,
          estadoId: 1,
          institucionResponsable: demanda.institucionId.toString(),
          institucionesColaboradoras: [],
          comentarios: [],
          actividad: [],
          politica: [],
          tiposInversion: demanda.demandaTipoInversiones.map((item: any) => {
            return item.tipoInversionId.toString();
          }),
          otrosTiposInversion: this.setOtrasInversiones(
            demanda.demandaTipoInversiones
          ),
          tipo: [],
          categoria: [],
          cantidad: [],
          beneficiarios: [],
          nivelDemanda: demanda.municipioId != null ? "2" : "1",
          contacto: [null],
          nombreCompletoContacto: [null],
          telefonoContacto: [null],
          descripcionContacto: [null],
          prioridad: demanda.prioridad,
          demandaTipoId: demanda.demandaTipoId,
          coordenadaX: demanda.coordenadaX,
          coordenadaY: demanda.coordenadaY,
          consolidadaEn: demanda.consolidadaEn,
          codigoSisplan: demanda.codigoSisplan,
          codigoSnip: demanda.codigoSnip,
          codigoPoa: demanda.codigoPoa,
          codigoPei: demanda.codigoPei,
          justificacionRechazo: demanda.justificacionRechazo

        });
      },
      (err: any) => {
        console.error(err);
        this.notFound = true;
        document.body.click();
        this.spinner.hide();
      },
      () => {
        document.body.click();
        this.spinner.hide();
      }
    );
  }

  agregarPolitica() {
    let politicaSelected = this.politica.value;
    if (politicaSelected != null) {
      if (this.listadoPoliticas == null) {
        this.listadoPoliticas = [];
      }
      if (
        this.listadoPoliticas.findIndex(
          (item) => item.PoliticaId == politicaSelected.id
        ) == -1
      ) {
        this.listadoPoliticas.push({
          PoliticaId: politicaSelected.id,
          Nombre: politicaSelected.name,
          CodigoDemanda: 0,
        });
      } else {
        this.serviceStr.typeWarning("No puede repetir politicas");
      }
    } else {
      this.serviceStr.typeError("No ha seleccionado politica");
    }
    this.politica.setValue(null);
  }

  eliminarPolitica(id: number) {
    this.listadoPoliticas.splice(id, 1);
  }

  agregarInstitucion() {
    let institucionSelected = this.institucionesColaboradoras.value;

    if (institucionSelected != null) {
      if (institucionSelected.id != this.institucionResponsable.value) {
        if (this.listadoInstituciones == null) {
          this.listadoInstituciones = [];
        }
        if (
          this.listadoInstituciones.findIndex(
            (item) => item.InstitucionId == institucionSelected.id
          ) == -1
        ) {
          this.listadoInstituciones.push({
            InstitucionId: institucionSelected.id,
            Nombre: institucionSelected.name,
            CodigoDemanda: 0,
          });
        } else {
          this.serviceStr.typeWarning("No puede repetir Instituciones");
        }
      } else {
        this.serviceStr.typeError("Esa ya es la institucion primaria");
      }
    } else {
      this.serviceStr.typeError("No ha seleccionado institucion colaboradora");
    }

    this.registerForm.patchValue({
      institucionesColaboradoras: null,
    });
  }

  eliminarInstitucion(id: number) {
    this.listadoInstituciones.splice(id, 1);
  }

  onInstitucionPrimariaChange(): void {
    let institucionSelected = this.institucionResponsable.value;
    if (this.listadoInstituciones != null) {
      let indice = this.listadoInstituciones.findIndex(
        (item) => item.InstitucionId == institucionSelected
      );
      if (indice != -1) {
        this.serviceStr.typeError("Esa ya es una institución colaboradora");
        this.institucionResponsable.setValue(null);
      }
    }
  }

  agregarActividad() {
    if (this.actividad.value != null) {
      if (this.listadoActividades == null) {
        this.listadoActividades = [];
      }
      this.listadoActividades.push({
        ActividadId: 0,
        CodigoDemanda: 0,
        Actividad: this.actividad.value,
      });
      this.activCount++;
    } else {
      this.serviceStr.typeError("No puede añadir actividades vacias");
    }

    this.registerForm.patchValue({
      actividad: null,
    });
  }

  eliminarActividad(id: number) {
    this.listadoActividades.splice(id, 1);
  }

  onTipoChange() {
    const otro = 8;
    let contieneOtro = this.tiposInversion.value.findIndex(
      (item) => item == otro
    );
    if (contieneOtro != -1) {
      this.otrosTiposShow = true;
    } else {
      this.otrosTiposShow = false;
    }
  }

  agregarBeneficiario() {
    let tipoSelected = this.tipo.value;
    let categoriaSelected = this.categoria.value;
    let cantidad = this.cantidad.value;

    if (tipoSelected != null && categoriaSelected != null && cantidad != null) {
      if (this.listadoBeneficiarios == null) {
        this.listadoBeneficiarios = [];
      }

      let combinedSelection = tipoSelected.name + categoriaSelected.name;
      let repetido = this.listadoBeneficiarios.findIndex(
        (item) => item.seleccionCombinada == combinedSelection
      );

      if (repetido == -1) {
        this.listadoBeneficiarios.push({
          Id: 0,
          tipoId: tipoSelected.id,
          tipoNombre: tipoSelected.name,
          categoriaId: categoriaSelected.id,
          categoriaNombre: categoriaSelected.name,
          cantidad: cantidad,
          Activo: 1,
          codigoDemanda: this.codigoDemanda,
          seleccionCombinada: combinedSelection,
        });

        this.registerForm.patchValue({
          tipo: null,
          categoria: null,
          cantidad: null,
        });
      } else {
        this.serviceStr.typeError(
          "Ya hay una seleccion con esa combinacion tipo-categoria"
        );
      }
    } else {
      this.serviceStr.typeError(
        "No ha rellenado todos los campos de beneficiarios"
      );
    }
  }

  removerBeneficiario(index: number) {
    this.listadoBeneficiarios.splice(index, 1);
  }

  agregarObjetivo() {
    let objetivoSelected: DropdownResponse = this.objetivo.value;

    if (objetivoSelected != null) {
      if (this.listadoObjetivos == null) {
        this.listadoObjetivos = [];
      }
      if (
        this.listadoObjetivos.findIndex(
          (item) => item.ObjetivoId == objetivoSelected.id
        ) == -1
      ) {
        this.listadoObjetivos.push({
          EjeId: this.eje.value,
          ObjetivoId: objetivoSelected.id,
          CodigoEje: objetivoSelected.extraInfo,
          Nombre: objetivoSelected.name,
          CodigoDemanda: 0,
        });
      } else {
        this.serviceStr.typeWarning("No puede repetir objetivos");
      }
    } else {
      this.serviceStr.typeError("No ha seleccionado objetivo");
    }
    this.objetivo.setValue(null);
    this.eje.setValue(null);
  }

  eliminarObjetivo(id: number) {
    this.listadoObjetivos.splice(id, 1);
  }

  agregarContacto() {
    if (
      this.nombreCompletoContacto.value != null &&
      this.telefonoContacto != null
    ) {
      if (this.listadoContactos == null) {
        this.listadoContactos = [];
      }
      this.listadoContactos.push({
        CodigoDemanda: 0,
        id: 0,
        nombreCompleto: this.nombreCompletoContacto.value,
        telefono: this.telefonoContacto.value,
        descripcion: this.descripcionContacto.value,
      });
    } else {
      this.serviceStr.typeError(
        "No puede añadir Contactos sin nombres y telefonos"
      );
    }

    this.registerForm.patchValue({
      nombreCompletoContacto: null,
      telefonoContacto: null,
      descripcionContacto: null,
    });
  }

  eliminarContacto(id: number) {
    this.listadoContactos.splice(id, 1);
  }

  //metodo para abrir el modal

  openVerticallyCentered(content) {
    this.modalService.open(content, {
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
  }

  submit() {

    //validaciones finales de listados
    if (this.listadoPoliticas.length < 1) {
      this.serviceStr.typeError(
        "Debe Tener al menos 1 politica asociada a la demanda"
      );
    }
    else if (this.listadoActividades.length < 1) {
      this.serviceStr.typeError(
        "Debe Tener al menos 1 actividad asociada a la demanda"
      );
    }
    else if (this.listadoBeneficiarios.length < 1) {
      this.serviceStr.typeError(
        "Debe Tener al menos 1 tipo de beneficiarios asociado a la demanda"
      );
    }
    else if (this.listadoObjetivos.length < 1) {
      this.serviceStr.typeError(
        "Debe Tener al menos 1 objetivo asociado a la demanda"
      );
    }
    else if (this.nivelDemanda.value == 1) {
      if (this.listadoContactos.length < 1) {
        this.serviceStr.typeError(
          "Debe Tener al menos 1 contacto asociado a la demanda"
        );
      }
    }
    else {
      this.enviar();
    }
  }

  enviar() {
    let listadoEjes = [];

    this.registerForm.patchValue({
      politica: this.listadoPoliticas,
      institucionesColaboradoras: this.listadoInstituciones,
      actividad: this.listadoActividades,
      beneficiarios: this.listadoBeneficiarios,
      objetivo: this.listadoObjetivos,
      eje: listadoEjes,
      contacto: this.listadoContactos,
      comentarios: this.listadoComentarios
    });

    const formValue = this.registerForm.value;

    this._demanda = new Demanda().deserialize({
      estatus: "A",
      anio: formValue.anio,
      regionId: parseInt(formValue.region, 10),
      provinciaId: parseInt(formValue.provincia, 10),
      municipioId: formValue.municipio != null ? parseInt(formValue.municipio, 10) : null,
      distritoMunicipalId: formValue.distrito != null ? parseInt(formValue.distrito, 10) : null,
      fuenteDemandaId: parseInt(formValue.fuente, 10),
      descripcion: formValue.demanda,
      tecnicoOMPPId: formValue.tecnico != null ? parseInt(formValue.tecnico, 10) : null,
      institucionId: parseInt(formValue.institucionResponsable, 10),
      estadoId: 1,
      temaComunId: parseInt(formValue.temaComunId, 10),
      prioridad: formValue.prioridad,
      demandaTipoId: formValue.demandaTipoId,
      coordenadaX: formValue.coordenadaX,
      coordenadaY: formValue.coordenadaY,
      consolidadaEn: formValue.consolidadaEn,
      codigoSisplan: formValue.codigoSisplan,
      codigoSnip: formValue.codigoSnip,
      codigoPoa: formValue.codigoPoa,
      codigoPei: formValue.codigoPei,
      justificacionRechazo: formValue.justificacionRechazo,
      demandaActividades:
        formValue.actividad != undefined
          ? formValue.actividad.map((item: any, i: number) => {
            return {
              id: item.ActividadId,
              estatus: "A",
              demandaId: this.typeEdit ? parseInt(this.demandaId, 10) : item.CodigoDemanda,
              numero: i + 1,
              descripcion: item.Actividad,
            };
          })
          : null,
      demandaBeneficiarios:
        formValue.beneficiarios != undefined
          ? formValue.beneficiarios.map((item: any) => {
            return {
              id: item.Id,
              estatus: "A",
              demandaId: this.typeEdit ? parseInt(this.demandaId, 10) : item.CodigoDemanda,
              beneficiarioCategoriaId: item.categoriaId,
              beneficiarioTipoId: item.tipoId,
              cantidad: item.cantidad,
            };
          })
          : null,
      demandaComentarios:
        formValue.Comentarios != undefined
          ? formValue.Comentarios.map((item: any) => {
            return {
              id: item.Id,
              estatus: "A",
              demandaId: this.typeEdit ? parseInt(this.demandaId, 10) : 0,
              comentrio: item.comentrio
            };
          })
          : null,
      demandaResultadosEND:
        formValue.objetivo != undefined
          ? formValue.objetivo.map((item: any) => {
            return {
              id: item.Id,
              estatus: "A",
              demandaId: this.typeEdit ? parseInt(this.demandaId, 10) : item.CodigoDemanda,
              ejeENDId: item.EjeId,
              objetivoENDId: item.ObjetivoId,
            };
          })
          : null,
      demandaPoliticasPNPSP:
        formValue.politica != undefined
          ? formValue.politica.map((item: any) => {
            return {
              id: item.Id,
              estatus: "A",
              demandaId: this.typeEdit ? parseInt(this.demandaId, 10) : item.CodigoDemanda,
              politicaPNPSPId: item.PoliticaId,
            };
          })
          : null,
      demandaTipoInversiones:
        formValue.tiposInversion != null
          ? formValue.tiposInversion.map((item: any) => {
            return {
              id: 0,
              estatus: "A",
              demandaId: this.typeEdit ? parseInt(this.demandaId, 10) : item.CodigoDemanda,
              tipoInversionId: parseInt(item, 10),
              tipoInversionOtros:
                item == 8 ? this.otrosTiposInversion.value : null,
            };
          })
          : null,
      demandaContactos:
        formValue.contacto != null
          ? formValue.contacto.map((item: any) => {
            return {
              demandaId: this.typeEdit ? parseInt(this.demandaId, 10) : item.CodigoDemanda,
              nombreCompleto: item.nombreCompleto,
              telefono: item.telefono,
              descripcion: item.descripcion,
              id: this.typeEdit ? item.id : 0,
              estatus: "A"
            };
          })
          : null,

      institucionesInvolucradas:
        formValue.institucionesColaboradoras != undefined
          ? formValue.institucionesColaboradoras.map((item: any) => {
            return {
              id: 0,
              estatus: "A",
              demandaId: this.typeEdit
                ? parseInt(this.demandaId, 10)
                : item.CodigoDemanda,
              institucionId: parseInt(item.InstitucionId, 10),
            };
          })
          : null,
    });

    this.spinner.show();
    console.log(formValue);
    console.log(this._demanda);

    if (this.typeEdit) {
      this._demanda.id = parseInt(this.demandaId, 10);
      this.demandaService
        .updateDemanda(this._demanda)
        .toPromise()
        .then((res: any) => {
          setTimeout(() => {
            this.serviceStr.typeSuccess("La demanda se actualizó con éxito");
            this.router.navigate(["/demandas"]);
            this.spinner.hide();
          }, 1000);
        })
        .catch((err) => {
          console.error(err);
          this.serviceStr.typeError(
            "Ocurrió un error inesperado al guardar la demanda, contacte con Soporte TIC"
          );
          this.spinner.hide();
        });
    } else {
      this.demandaService
        .createDemanda(this._demanda)
        .toPromise()
        .then((res: any) => {
          setTimeout(() => {
            this.serviceStr.typeSuccess("La demanda se registró con éxito");
            this.router.navigate(["/demandas"]);
            this.spinner.hide();
          }, 1000);
        })
        .catch((err) => {
          console.error(err);
          this.serviceStr.typeError(
            "Ocurrió un error inesperado al guardar la demanda, contacte con Soporte TIC"
          );
          this.spinner.hide();
        });
    }
    //this.refrescar();
  }

  refrescar() {
    let nivel = this.nivelDemanda.value;
    this.registerForm.reset();
    this.nivelDemanda.setValue(nivel);
    this.listadoPoliticas = [];
    this.listadoObjetivos = [];
    this.listadoInstituciones = [];
    this.listadoActividades = [];
    this.listadoBeneficiarios = [];
    this.listadoContactos = [];
    this.InversionesSelected = [];
    this.listadoComentarios = [];
    this.otrosTiposShow = false;
  }

  setListasDemandas(demanda: Demanda): void {
    this.listadoPoliticas = demanda.demandaPoliticasPNPSP.map((item: any) => {
      return {
        id: item.id,
        CodigoDemanda: item.demandaId,
        PoliticaId: item.politicaPNPSPId,
        Nombre: item.nombrePolitica,
      };
    });
    this.listadoInstituciones = demanda.institucionesInvolucradas.map(
      (item: any) => {
        return {
          Id: item.id,
          CodigoDemanda: item.demandaId,
          InstitucionId: item.institucionId,
          Nombre: item.nombreInstitucion,
        };
      }
    );
    this.listadoActividades = demanda.demandaActividades.map(
      (item: any, i: number) => {
        return {
          ActividadId: item.id,
          CodigoDemanda: item.demandaId,
          Actividad: item.descripcion,
        };
      }
    );
    this.listadoContactos = demanda.municipioId == null ? demanda.demandaContactos.map((item: any) => {
      return {
        CodigoDemanda: item.demandaId,
        id: item.id,
        nombreCompleto: item.nombreCompleto,
        telefono: item.telefono,
        descripcion: item.descripcion,
      };
    }) : [];

    this.listadoBeneficiarios = demanda.demandaBeneficiarios.map(
      (item: any) => {
        return {
          Id: item.id,
          codigoDemanda: item.demandaId,
          categoriaId: item.beneficiarioCategoriaId,
          tipoId: item.beneficiarioTipoId,
          cantidad: item.cantidad,
          tipoNombre: item.nombreTipo,
          categoriaNombre: item.nombreCategoria,
          seleccionCombinada: item.nombreTipo + item.nombreCategoria,
        };
      }
    );

    this.listadoObjetivos = demanda.demandaResultadosEND.map((item: any) => {
      return {
        Id: item.id,
        CodigoDemanda: item.demandaId,
        EjeId: item.ejeENDId,
        ObjetivoId: item.objetivoENDId,
        CodigoEje: item.nombreEjeEnd,
        Nombre: item.nombreObjetivoEnd,
      };
    });

    this.listadoComentarios = demanda.demandaComentarios.map((item: any) => {
      return {
        id: item.id,
        demandaId: item.demandaId,
        comentrio: item.comentrio,
        estatus: item.estatus
      };
    });

    let params = new HttpParams()
      .set('param', `funcion`)
      .set('content', demanda.finalidadTemaComun);

    this.listadoTemaComunFuncion = this.temaComunService.getTemaComunByParam(params);

    /*********************************************************************************** */
    let params2 = new HttpParams()
      .set('param', `nombre`)
      .set('content', demanda.funcionTemaComun);

    this.listadoTemaComun = this.temaComunService.getTemaComunByParam(params2);
  }

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
    if (this.typeEdit) {
      this.BuscarMap(this.demandaForEdit);
    }

  }

  BuscarMap(Objeto: Demanda): void {
    this.capas = [];
    this.capas.push(
      L.marker([Number(Objeto.coordenadaX), Number(Objeto.coordenadaY)], {
        icon: L.icon({
          iconSize: [25, 41],
          iconAnchor: [15, 41],
          iconUrl: 'assets/mapa//marker-icon.png',
          shadowUrl: 'assets/mapa/marker-shadow.png',

        })
      }).bindPopup(`
   <strong>Región:</strong> ${Objeto.nombreRegion} <br/>
   <strong>Provincia: </strong> ${Objeto.nombreProvincia} <br/>
   <strong>Municipio: </strong> ${Objeto.nombreMunicipio} <br/>
   <strong>Coordenada X:</strong> ${Objeto.coordenadaX} <br/>
   <strong>Coordenada Y:</strong> ${Objeto.coordenadaY}`,
        { autoClose: true, autoPan: true })
    );

  }

  manejarClick(event: LeafletMouseEvent) {
    const latitud = Number(event.latlng.lat);
    const longitud = Number(event.latlng.lng);
    this.registerForm.patchValue({
      coordenadaX: latitud,
      coordenadaY: longitud
    });
    this.capas = [];
    this.capas.push(
      L.marker([latitud, longitud], {
        icon: L.icon({
          iconSize: [25, 41],
          iconAnchor: [15, 41],
          iconUrl: 'assets/mapa//marker-icon.png',
          shadowUrl: 'assets/mapa/marker-shadow.png',

        })
      }).bindPopup(`
        <strong>Coordenada X:</strong> ${latitud} <br/>
        <strong>Coordenada Y:</strong> ${longitud}`,
        { autoClose: true, autoPan: true })

    );

  }

  onFinalidadChange() {

    let params = new HttpParams()
      .set('param', `funcion`)
      .set('content', this.finalidad.value);

    this.listadoTemaComunFuncion = this.temaComunService.getTemaComunByParam(params);
    this.listadoTemaComun = null;
    this.temaComunId.setValue(null);
    this.funcion.setValue(null);

  }

  onFuncionChange() {

    let params = new HttpParams()
      .set('param', `nombre`)
      .set('content', this.funcion.value);

    this.listadoTemaComun = this.temaComunService.getTemaComunByParam(params);
    this.temaComunId.setValue(null);


  }

  openModalComentario(contentComentario) {
    this.modalService.open(contentComentario, {
      centered: true,
      backdrop: "static",
      keyboard: false,
    });

  }

  //TODO
  agregarComentario() {
    this.listadoComentarios.push(
      {
        demandaId: 0,
        comentrio: this.comentarios.value,
        id: 0,
        estatus: "A"
      }
    )
  }



}
