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


@Component({
  selector: 'app-registro-demandas-form',
  templateUrl: './registro-demandas-form.component.html',
  styleUrls: ['./registro-demandas-form.component.scss']
})
export class RegistroDemandasFormComponent implements OnInit {

  constructor(private formBuilder: FormBuilder,
    private usernameUnicoService: UsernameUnicoService,
    private dropDownService: DropDownServiceService) { }

  notFound = false;

  cities = [
    { id: 1, name: 'Vilnius' },
    { id: 2, name: 'Kaunas' },
    { id: 3, name: 'Pavilnys', disabled: true },
    { id: 4, name: 'Pabradė' },
    { id: 5, name: 'Klaipėda' }
  ];

  //propiedades
  codigoDemanda: string = 'codigoPrueba';
  anios: IDropDown[] = [];
  regiones: IDropDown[] = [];
  provincias: IDropDown[] = [];
  municipios: IDropDown[] = [];
  distritosMunicipales: IDropDown[] = [];
  fuenteDemandas: IDropDown[] = [];
  ejesEnd: IDropDown[] = [];
  objetivosEnd: IDropDown[] = [];
  instituciones: IDropDown[] = [];
  politicas: any[] = [];
  actividades: IDropDown[] = [];
  tecnicos: IDropDown[] = [];

  listadoPoliticas: any[] = [];
  listadoInstituciones: any[] = [];
  listadoActividades: any[] = [];

  politicaSelected: any;

  polCount = 0;  // temporalfield
  instCount = 0;  // temporalfield
  activCount = 0;  // temporalfield




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
  get institucionesColaboradoras()
  {
    return this.registerForm.get('institucionesColaboradoras');
  }
  get actividad()
  {
    return this.registerForm.get('actividad');
  }



  registerForm = this.formBuilder.group({
    año: [''],
    region: [''],
    provincia: [''],
    municipio: [''],
    distrito: [''],
    fuente: [''],
    eje: [''],
    objetivo: [''],
    demanda: ['', {
      validators: [Validators.required, Validators.minLength(15)],
      asyncValidators: [this.usernameUnicoService.validate.bind(this.usernameUnicoService)]
    }],
    tecnico: [],
    institucionResponsable: [''],
    institucionesColaboradoras: [''],
    beneficiarios: ['', { validators: [Validators.required], updateOn: 'blur' }],
    unidad: [''],
    comentarios: [''],
    telefonos: this.formBuilder.array([]),
    actividad: [''],
    politica: ['']
    /* username: ['', {
      validators: [Validators.required],
      asyncValidators: [this.usernameUnicoService.validate.bind(this.usernameUnicoService)],
      updateOn: 'blur'
    }],
    password: ['', {
      validators: [Validators.required, Validators.minLength(4), passwordValidation()]
    }], */
  });

  //Lleno todos los dropdowns fijos en el inicio
  ngOnInit() {
    this.llenarDropDownFijos();
  }

  // Todos estos rellenados son mientras tanto habilitamos el API, entonces cambiaran la logica.
  llenarDropDownFijos(): void {

    this.notFound = false;

    // llena el año
    this.dropDownService.getAños().subscribe((añosFromApi: Iaño[]) => {
      for (let item of añosFromApi) {
        this.anios.push({ texto: String(item.Year), valor: item.id });
      }
    }, (error) => {
      console.error(error);
      this.notFound = true;
    });

    // llena La region
    this.dropDownService.getRegiones().subscribe((regionesFromApi: Iregion[]) => {
      for (let item of regionesFromApi) {
        this.regiones.push({ texto: item.Nombre, valor: item.RegionId });
      }
    }, (error) => {
      console.error(error);
      this.notFound = true;
    });

    // llena La Fuente
    this.dropDownService.getFuentes().subscribe((fuentesFromApi: IfuenteDemanda[]) => {
      for (let item of fuentesFromApi) {
        this.fuenteDemandas.push({ texto: item.Nombre, valor: item.FuenteId });
      }
    }, (error) => {
      console.error(error);
      this.notFound = true;
    });

    // llena ejeEnd
    this.dropDownService.getEjes().subscribe((ejesFromApi: IejeEnd[]) => {
      for (let item of ejesFromApi) {
        this.ejesEnd.push({ texto: item.Nombre, valor: item.EjeId });
      }
    }, (error) => {
      console.error(error);
      this.notFound = true;
    });

    // llena Tecnicos
    this.dropDownService.getTecnicos().subscribe((tecnicosFromApi: Itecnico[]) => {
      for (let item of tecnicosFromApi) {
        this.tecnicos.push({ texto: item.Nombre, valor: item.Id });
      }
    }, (error) => {
      console.error(error);
      this.notFound = true;
    });

    // llena Instituciones Responsables
    this.dropDownService.getInstituciones().subscribe((InstitucionesFromApi: Iinstitucion[]) => {
      for (let item of InstitucionesFromApi) {
        this.instituciones.push({ texto: item.Nombre, valor: item.IntitucionId });
      }
    }, (error) => {
      console.error(error);
      this.notFound = true;
    });

    // llena Politicas
    this.dropDownService.getPoliticas().subscribe((politicasFromApi: Ipolitica[]) => {
      for (let item of politicasFromApi) {
        this.politicas.push({ texto: item.Nombre, valor: item.PoliticaId });
      }
    }, (error) => {
      console.error(error);
      this.notFound = true;
    });

  } // fin llenarDropDownFijos

  //Metodos eventos change

  // llena Las provincias de acuerdo a la region
  onRegionChange(id: number): void {

    this.provincias = [];

    this.dropDownService.getProvincias().subscribe((provinciasFromApi: Iprovincia[]) => {
      for (let item of provinciasFromApi) {
        if (item.RegionId == id) {
          this.provincias.push({ texto: item.Nombre, valor: item.Key });
        }
      }
    }, (error) => {
      console.error(error);
      this.notFound = true;
    });
  }

  // llena Los municipios de acuerdo a la provincia
  onProvinciaChange(id: number): void {

    this.municipios = [];

    this.dropDownService.getMunicipios().subscribe((municipiosFromApi: Imunicipio[]) => {
      for (let item of municipiosFromApi) {
        if (item.ProviceKey == id) {
          this.municipios.push({ texto: item.Nombre, valor: item.Key });
        }
      }
    }, (error) => {
      console.error(error);
      this.notFound = true;
    });

  }

  // llena Los distritos de acuerdo a los municipios
  onMunicipiosChange(id: number): void {

    this.distritosMunicipales = [];

    this.dropDownService.getDistritos().subscribe((distritoFromApi: IdistritoMunicipal[]) => {
      for (let item of distritoFromApi) {
        if (item.MunicipioKey == id) {
          this.distritosMunicipales.push({ texto: item.Nombre, valor: item.DistritoKey });
        }
      }
    }, (error) => {
      console.error(error);
      this.notFound = true;
    });

  }

  // llena Los distritos de acuerdo a los municipios
  onEjeChange(id: number): void {

    this.objetivosEnd = [];

    this.dropDownService.getObjetivos().subscribe((objetivosFromApi: IobjetivoEnd[]) => {
      for (let item of objetivosFromApi) {
        if (item.EjeId == id) {
          this.objetivosEnd.push({ texto: item.Nombre, valor: item.ObjetivoId });
        }
      }
    }, (error) => {
      console.error(error);
      this.notFound = true;
    });

  }

  //end dropDowns

  //****************************otros metodos******************************* */

  agregarPolitica() {
console.log(this.politicaSelected);
    this.listadoPoliticas.push({ PoliticaId: this.polCount, Nombre: this.politica.value, Activo: 1 })
    this.polCount++;
    this.registerForm.patchValue({
      politica: this.listadoPoliticas
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

    this.listadoInstituciones.push({ InstitucionId: this.instCount, Nombre:this.institucionesColaboradoras.value, Activo: 1 })
    this.instCount++;
    this.registerForm.patchValue({
      institucionesColaboradoras: this.listadoInstituciones
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
    this.listadoActividades.push({ ActividadId: this.activCount, CodigoDemanda: this.codigoDemanda, Actividad:""+(this.activCount + 1)+"-"+this.actividad.value })
    this.activCount++;
     this.registerForm.patchValue({
      actividad: ''
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

  agregarTelefono() {
    const telefonoFormGroup = this.formBuilder.group({
      telefono: '',
      descripcion: ''
    });
    this.telefonos.push(telefonoFormGroup);
  }

  removerTelefono(indice: number) {
    this.telefonos.removeAt(indice);
  }

  submit() {
    if (!this.registerForm.valid) {
      alert('Alguna regla de validación no se está cumpliendo');
      return;
    }
    console.log(this.registerForm.value);
  }

  refrescar() {
    this.registerForm.patchValue({
      /* username: '',
      password: '' */
    });
    this.telefonos.controls.splice(0, this.telefonos.length);
  }


}

