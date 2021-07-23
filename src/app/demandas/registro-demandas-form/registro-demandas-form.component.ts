import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormArray } from '@angular/forms';
import { Iaño } from 'app/shared/models/iaño';
import { IdistritoMunicipal } from 'app/shared/models/idistrito-municipal';
import { IDropDown } from 'app/shared/models/Idrop-down';
import { IejeEnd } from 'app/shared/models/ieje-end';
import { IfuenteDemanda } from 'app/shared/models/ifuente-demanda';
import { Iinstitucion } from 'app/shared/models/iinstitucion';
import { Imunicipio } from 'app/shared/models/imunicipio';
import { IobjetivoEnd } from 'app/shared/models/iobjetivo-end';
import { Ipolitica } from 'app/shared/models/ipolitica';
import { Iprovincia } from 'app/shared/models/iprovincia';
import { Iregion } from 'app/shared/models/iregion';
import { Itecnico } from 'app/shared/models/itecnico';
import { DropDownServiceService } from 'app/shared/services/drop-down-service.service';
import { passwordValidation } from '../validations/password-validation.directive';
import { UsernameUnicoService } from '../validations/username-unico.directive';
import { NgSelectModule, NgOption } from '@ng-select/ng-select';
import { Observable, of } from 'rxjs';



@Component({
  selector: 'app-registro-demandas-form',
  templateUrl: './registro-demandas-form.component.html',
  styleUrls: ['./registro-demandas-form.component.scss']
})
export class RegistroDemandasFormComponent implements OnInit {

  constructor(private formBuilder: FormBuilder,
    private usernameUnicoService: UsernameUnicoService,
    private dropDownService: DropDownServiceService) { }

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
  listadoInstituciones: any[];
  listadoActividades: any[];

  activCount=0;

  //getters
  get comentarios() {
    return this.registerForm.get('comentarios');
  }
  get beneficiarios() {
    return this.registerForm.get('beneficiarios');
  }
  get telefonos() {
    return this.registerForm.get('telefonos') as FormArray;
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

  registerForm = this.formBuilder.group({
    año: [],
    region: [],
    provincia: [],
    municipio: [],
    distrito: [],
    fuente: [],
    eje: [],
    objetivo: [],
    demanda: ['', {
      validators: [Validators.required, Validators.minLength(15)],
      asyncValidators: [this.usernameUnicoService.validate.bind(this.usernameUnicoService)]
    }],
    tecnico: [],
    institucionResponsable: [],
    institucionesColaboradoras: [],
    beneficiarios: ['', { validators: [Validators.required], updateOn: 'blur' }],
    unidad: [''],
    comentarios: [''],
    actividad: [''],
    politica: []
    /*
    password: ['', {
      validators: [Validators.required, Validators.minLength(4), passwordValidation()]
    }], */
  });

  // rellena DropDowns.

  llenarDropDownFijos(): void {

    // llena el año
    this.anios = this.dropDownService.getAños();

    // llena La region
    this.regiones = this.dropDownService.getRegiones();

    // llena La Fuente
    this.fuenteDemandas = this.dropDownService.getFuentes();

    // llena ejeEnd
    this.ejesEnd= this.dropDownService.getEjes();

    // llena Tecnicos
    this.tecnicos = this.dropDownService.getTecnicos();

    // llena Instituciones Responsables
   this.instituciones = this.dropDownService.getInstituciones();

    // llena Politicas
    this.politicas = this.dropDownService.getPoliticas();

  } // fin llenarDropDownFijos

  //Metodos eventos change

  // llena Las provincias de acuerdo a la region
  onRegionChange(id: number): void {
    this.provincias = this.dropDownService.getProvinciasByRegion(id);
    this.registerForm.patchValue({
         provincia:null
    });
  }

  // llena Los municipios de acuerdo a la provincia
  onProvinciaChange(id: number): void {

    this.municipios = this.dropDownService.getMunicipiosByProvincia(id);
    this.registerForm.patchValue({
      municipio:null
    });
  }

  // llena Los distritos de acuerdo a los municipios
  onMunicipiosChange(id: number): void {

    this.distritosMunicipales = this.dropDownService.getDistritosByMunicipio(id);
    this.registerForm.patchValue({
      distrito:null
    });
  }

  // llena Los objetivos de acuerdo a los ejes
  onEjeChange(id: number): void {
    this.objetivosEnd = this.dropDownService.getObjetivosByEjeId(id);
    this.registerForm.patchValue({
      objetivo:null
    });
  }
  //end dropDowns

  //****************************otros metodos******************************* */

  agregarPolitica() {
    if(this.listadoPoliticas == null)
    {
      this.listadoPoliticas = [];
    }
    let politicaSelected = this.politica.value;
    this.listadoPoliticas.push({ PoliticaId: politicaSelected.PoliticaId, Nombre: politicaSelected.Nombre, Activo: politicaSelected.Activo })
    this.registerForm.patchValue({
      politica:null
    });
  }

  eliminarPolitica(id: number) {

    this.listadoPoliticas.splice(
      this.listadoPoliticas.find((item, index) => {
        if (item.PoliticaId == id)
          return index
      }), 1
    );
  }

  agregarInstitucion() {
    if(this.listadoInstituciones == null)
    {
      this.listadoInstituciones = [];
    }
    let institucionSelected = this.institucionesColaboradoras.value;
    console.log(institucionSelected);
    this.listadoInstituciones.push({ InstitucionId: institucionSelected.InstitucionId, Nombre: institucionSelected.Nombre, Activo: institucionSelected.Activo })
    this.registerForm.patchValue({
      institucionesColaboradoras:null
    });
  }

  eliminarInstitucion(id: number) {

    this.listadoInstituciones.splice(
      this.listadoInstituciones.find((item, index) => {
        if (item.InstitucionId == id)
          return index
      }), 1
    );
  }

  agregarActividad() {
    if(this.listadoActividades == null)
    {
      this.listadoActividades = [];
    }
    this.listadoActividades.push({ ActividadId: this.activCount, CodigoDemanda: this.codigoDemanda, Actividad: "" + (this.activCount + 1) + "-" + this.actividad.value })
    this.activCount++;
    this.registerForm.patchValue({
      actividad: null
    });
  }

  eliminarActividad(id: number) {

    this.listadoActividades.splice(
      this.listadoActividades.find((item, index) => {
        if (item.ActividadId == id)
          return index
      }), 1
    );
  }

  submit() {
    if (!this.registerForm.valid) {
      alert('Alguna regla de validación no se está cumpliendo');
      return;
    }
    this.registerForm.patchValue({
      politica: this.listadoPoliticas,
      institucionesColaboradoras: this.listadoInstituciones,
      actividad: this.listadoActividades
    });
    console.log(this.registerForm.value);
  }

  refrescar() {
    this.registerForm.patchValue({

    });

  }


}

