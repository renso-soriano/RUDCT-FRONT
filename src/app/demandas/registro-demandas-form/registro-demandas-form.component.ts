import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, Validators, FormArray } from '@angular/forms';
import { DropDownServiceService } from 'app/shared/services/drop-down-service.service';
import { passwordValidation } from '../validations/password-validation.directive';
import { UsernameUnicoService } from '../validations/username-unico.directive';
import { NgSelectModule, NgOption } from '@ng-select/ng-select';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { NGXToastrService } from 'app/shared/services/ngxtoastr.service';
import { IejeEnd } from 'app/shared/models/ieje-end';
import { ItipoInversion } from 'app/shared/models/iTipoInversion';
import { ItipoBeneficiario } from 'app/shared/models/iTipoBeneficiario';


@Component({
  selector: 'app-registro-demandas-form',
  templateUrl: './registro-demandas-form.component.html',
  styleUrls: ['./registro-demandas-form.component.scss'],
  providers: [NGXToastrService]
})
export class RegistroDemandasFormComponent implements OnInit {

  constructor(private formBuilder: FormBuilder,
    private usernameUnicoService: UsernameUnicoService,
    private dropDownService: DropDownServiceService,
    private serviceStr: NGXToastrService) { }

  //Lleno todos los dropdowns fijos en el inicio
  ngOnInit() {
    this.llenarDropDownFijos();
  }

  //propiedades
  codigoDemanda: string = 'codigoPrueba';
  anios: Observable<any[]>;
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

  listadoPoliticas: any[];
  listadoObjetivos: any[];
  listadoInstituciones: any[];
  listadoActividades: any[];
  listadoEjes: any[];
  listadoInversion: any[];
  InversionesSelected: any[] = [];
  listadoTipoBeneficiarios: Observable<any[]>;
  listadoCategoriaBeneficiarios: Observable<any[]>;
  listadoBeneficiarios: any[];
  beneficiariosSelected: any[] = [];

  activCount = 0;
  notFound = false;
  otrosTiposShow = false;


  registerForm = this.formBuilder.group({
    anio: [null, { validators: [Validators.required] }],
    region: [null, { validators: [Validators.required] }],
    provincia: [null, { validators: [Validators.required] }],
    municipio: [null, { validators: [Validators.required] }],
    distrito: [],
    fuente: [null, { validators: [Validators.required] }],
    eje: [null],
    objetivo: [null],
    demanda: ['', {
      validators: [Validators.required, Validators.minLength(15)],
      asyncValidators: [this.usernameUnicoService.validate.bind(this.usernameUnicoService)]
    }],
    tecnico: [null, { validators: [Validators.required] }],
    institucionResponsable: [null, { validators: [Validators.required] }],
    institucionesColaboradoras: [],
    comentarios: [''],
    actividad: [null],
    politica: [],
    tiposInversion: [null],
    otrosTiposInversion: ['', { validators: [Validators.required] }],
    inversionchkBox: [null],
    tipo: [null],
    categoria: [null],
    cantidad: [null],
    beneficiarios: [null]
    /*
    password: ['', {
      validators: [Validators.required, Validators.minLength(4), passwordValidation()]
    }], */
  });

  //getters
  get comentarios() {
    return this.registerForm.get('comentarios');
  }
  get password() {
    return this.registerForm.get('password');
  }
  get demanda() {
    return this.registerForm.get('demanda');
  }
  get politica() {
    return this.registerForm.get('politica');
  }
  get institucionResponsable() {
    return this.registerForm.get('institucionResponsable');
  }
  get institucionesColaboradoras() {
    return this.registerForm.get('institucionesColaboradoras');
  }
  get actividad() {
    return this.registerForm.get('actividad');
  }
  get region() {
    return this.registerForm.get('region');
  }
  get provincia() {
    return this.registerForm.get('provincia');
  }
  get municipio() {
    return this.registerForm.get('municipio');
  }
  get distrito() {
    return this.registerForm.get('distrito');
  }
  get fuente() {
    return this.registerForm.get('fuente');
  }
  get eje() {
    return this.registerForm.get('eje');
  }
  get objetivo() {
    return this.registerForm.get('objetivo');
  }
  get tecnico() {
    return this.registerForm.get('tecnico');
  }
  get anio() {
    return this.registerForm.get('anio');
  }
  get otrosTiposInversion() {
    return this.registerForm.get('otrosTiposInversion');
  }
  get tipo() {
    return this.registerForm.get('tipo');
  }
  get categoria() {
    return this.registerForm.get('categoria');
  }
  get cantidad() {
    return this.registerForm.get('cantidad');
  }
  get beneficiarios() {
    return this.registerForm.get('beneficiarios');
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

    // llena Tecnicos
    this.tecnicos = this.dropDownService.getTecnicos();

    // llena Instituciones Responsables
    this.instituciones = this.dropDownService.getInstituciones();

    // llena Politicas
    this.politicas = this.dropDownService.getPoliticas();

    //tipoInversion
    this.dropDownService.getTipoInversion()
      .subscribe((inversionesFromTheAPI: ItipoInversion[]) => {
        this.listadoInversion = inversionesFromTheAPI;
      }, (err: any) => {
        console.error(err);
        this.notFound = true;
      });


    //tipoBeneficiario
    this.listadoTipoBeneficiarios = this.dropDownService.getTipoBeneficiarios();

    //categoriaBeneficiario
    this.listadoCategoriaBeneficiarios = this.dropDownService.getCategoriasBeneficiarios();

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
      distrito: null
    });
  }

  // llena Los municipios de acuerdo a la provincia
  onProvinciaChange(id: number): void {

    this.municipios = this.dropDownService.getMunicipiosByProvincia(id);
    this.distritosMunicipales = null;
    this.registerForm.patchValue({
      municipio: null,
      distrito: null
    });
  }

  // llena Los distritos de acuerdo a los municipios
  onMunicipiosChange(id: number): void {
    this.distritosMunicipales = this.dropDownService.getDistritosByMunicipio(id);
    this.distrito.setValue(null);
  }

  // llena Los objetivos de acuerdo a los ejes
  onEjeChange(id: number): void {
    console.log(id);
    this.objetivosEnd = this.dropDownService.getObjetivosByEjeId(id);
    this.objetivo.setValue(null);
  }
  //end dropDowns

  //****************************otros metodos******************************* */

  agregarPolitica() {

    let politicaSelected = this.politica.value;
    if (politicaSelected != null) {
      if (this.listadoPoliticas == null) {
        this.listadoPoliticas = [];
      }
      if (this.listadoPoliticas.findIndex(item => item.PoliticaId == politicaSelected.PoliticaId) == -1) {
        this.listadoPoliticas.push({ PoliticaId: politicaSelected.PoliticaId, Nombre: politicaSelected.Nombre, Activo: politicaSelected.Activo })
      }
      else {
        this.serviceStr.typeWarning('No puede repetir politicas');
      }
    } else {
      this.serviceStr.typeError('No ha seleccionado politica');
    }
    this.politica.setValue(null);

  }

  eliminarPolitica(id: number) {
    this.listadoPoliticas.splice(id, 1);
  }

  agregarInstitucion() {

    let institucionSelected = this.institucionesColaboradoras.value;

    if (institucionSelected != null) {
      if (institucionSelected.InstitucionId != this.institucionResponsable.value) {
        if (this.listadoInstituciones == null) {
          this.listadoInstituciones = [];
        }
        if (this.listadoInstituciones.findIndex(item => item.InstitucionId == institucionSelected.InstitucionId) == -1) {
          this.listadoInstituciones.push({ InstitucionId: institucionSelected.InstitucionId, Nombre: institucionSelected.Nombre, Activo: institucionSelected.Activo })
        }
        else {
          this.serviceStr.typeWarning('No puede repetir Instituciones');
        }
      } else {
        this.serviceStr.typeError('Esa ya es la institucion primaria');
      }

    } else {
      this.serviceStr.typeError('No ha seleccionado institucion colaboradora');
    }

    this.registerForm.patchValue({
      institucionesColaboradoras: null
    });
  }

  eliminarInstitucion(id: number) {
    this.listadoInstituciones.splice(id, 1);
  }

  onInstitucionPrimariaChange(): void {
    let institucionSelected = this.institucionResponsable.value;
    if (this.listadoInstituciones != null) {
      let indice = this.listadoInstituciones.findIndex(item => item.InstitucionId == institucionSelected);
      if (indice != -1) {
        this.serviceStr.typeError('Esa ya es una institución colaboradora');
        this.institucionResponsable.setValue(null);
      }
    }
  }

  agregarActividad() {

    if (this.actividad.value != null) {
      if (this.listadoActividades == null) {
        this.listadoActividades = [];
      }
      this.listadoActividades.push({ ActividadId: this.activCount, CodigoDemanda: this.codigoDemanda, Actividad: this.actividad.value })
      this.activCount++;
    }
    else {
      this.serviceStr.typeError('No puede añadir actividades vacias');
    }

    this.registerForm.patchValue({
      actividad: null
    });
  }

  eliminarActividad(id: number) {
    this.listadoActividades.splice(id, 1);
  }

  onTipoInversionChange(evento: any, tipo: string) {
    if (tipo != 'Otro') {
      if (evento.target.checked) {
        this.InversionesSelected.push(tipo);
      }
      else {
        this.InversionesSelected = this.InversionesSelected.filter(t => t != tipo);
      }
    }
    else {
      this.otrosTiposShow = !this.otrosTiposShow;
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

      let combinedSelection = tipoSelected.Nombre + categoriaSelected.Nombre;
      let repetido = this.listadoBeneficiarios.findIndex(item => item.seleccionCombinada == combinedSelection);

      if (repetido == -1) {
        this.listadoBeneficiarios.push({
          Id: 0, tipoId: tipoSelected.Id, tipoNombre: tipoSelected.Nombre,
          categoriaId: categoriaSelected.Id, categoriaNombre: categoriaSelected.Nombre,
          cantidad: cantidad, Activo: 1, codigoDemanda: this.codigoDemanda,
          seleccionCombinada: combinedSelection
        });

        this.registerForm.patchValue({
          tipo: null,
          categoria: null,
          cantidad: null,
        });

      } else {
        this.serviceStr.typeError('Ya hay una seleccion con esa combinacion tipo-categoria');
      }
    } else {
      this.serviceStr.typeError('No ha rellenado todos los campos de beneficiarios');
    }

  }

  removerBeneficiario(index: number) {
    this.listadoBeneficiarios.splice(index, 1);
  }

  agregarObjetivo() {

    let objetivoSelected = this.objetivo.value;

    if (objetivoSelected != null) {
      if (this.listadoObjetivos == null) {
        this.listadoObjetivos = [];
      }
      if (this.listadoObjetivos.findIndex(item => item.ObjetivoId == objetivoSelected.ObjetivoId) == -1) {
        this.listadoObjetivos.push({
          EjeId: objetivoSelected.EjeId, ObjetivoId: objetivoSelected.ObjetivoId,
          CodigoEje: objetivoSelected.CodigoEje, Nombre: objetivoSelected.Nombre, Activo: objetivoSelected.Activo
        })
      }
      else {
        this.serviceStr.typeWarning('No puede repetir objetivos');
      }
    } else {
      this.serviceStr.typeError('No ha seleccionado objetivo');
    }
    this.objetivo.setValue(null);
    this.eje.setValue(null);

  }

  eliminarObjetivo(id: number) {
    this.listadoObjetivos.splice(id, 1);
  }

  submit() {
    if (!this.registerForm.valid) {
      this.serviceStr.typeError('Alguna regla de validación no se está cumpliendo');
      return;
    }
    if (this.otrosTiposShow) {
      this.InversionesSelected.push(this.otrosTiposInversion.value);
    }
    this.registerForm.patchValue({
      politica: this.listadoPoliticas,
      institucionesColaboradoras: this.listadoInstituciones,
      actividad: this.listadoActividades,
      tiposInversion: this.InversionesSelected,
      beneficiarios: this.listadoBeneficiarios,
      objetivo: this.listadoObjetivos

    });
    console.log(this.registerForm.value);
    this.refrescar();
  }

  refrescar() {

    this.registerForm.reset();
    this.listadoPoliticas = null;
    this.listadoObjetivos = null;
    this.listadoInstituciones = null;
    this.listadoActividades = null;
    this.listadoBeneficiarios = null;
    this.InversionesSelected = [];
    this.otrosTiposShow = false;

  }


}

