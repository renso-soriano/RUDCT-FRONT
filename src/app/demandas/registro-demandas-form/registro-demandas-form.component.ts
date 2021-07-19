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
import { Iprovincia } from 'app/shared/models/iprovincia';
import { Iregion } from 'app/shared/models/iregion';
import { Itecnico } from 'app/shared/models/itecnico';
import { Suscripcion } from 'app/shared/models/suscripcion.enum';
import { DropDownServiceService } from 'app/shared/services/drop-down-service.service';
import { passwordValidation } from '../validations/password-validation.directive';
import { UsernameUnicoService } from '../validations/username-unico.directive';

@Component({
  selector: 'app-registro-demandas-form',
  templateUrl: './registro-demandas-form.component.html',
  styleUrls: ['./registro-demandas-form.component.scss']
})
export class RegistroDemandasFormComponent implements OnInit {

  constructor(private formBuilder: FormBuilder,
    private usernameUnicoService: UsernameUnicoService, private dropDownService: DropDownServiceService) { }

  notFound = false;

  suscripciones: any[] = [];

  anios: IDropDown[] = [];
  regiones: IDropDown[] = [];
  provincias: IDropDown[] = [];
  municipios: IDropDown[] = [];
  distritosMunicipales: IDropDown[] = [];
  fuenteDemandas: IDropDown[] = [];
  ejesEnd: IDropDown[] = [];
  objetivosEnd: IDropDown[] = [];
  institucionesResponsables: IDropDown[] = [];
  politicas: IDropDown[] = [];
  actividades: IDropDown[] = [];
  tecnicos: IDropDown[] = [];
  institucionesColaboradoras: IDropDown[] = [];


  get username() {
    return this.registerForm.get('username');
  }

  get password() {
    return this.registerForm.get('password');
  }

  get telefonos() {
    return this.registerForm.get('telefonos') as FormArray;
  }

  registerForm = this.formBuilder.group({
    username: ['', {
      validators: [Validators.required],
      asyncValidators: [this.usernameUnicoService.validate.bind(this.usernameUnicoService)],
      updateOn: 'blur'
    }],
    password: ['', {
      validators: [Validators.required, Validators.minLength(4), passwordValidation()]
    }],
    suscripcion: [Suscripcion.Basica],
    promociones: [true],
    telefonos: this.formBuilder.array([]),
    año: ['2018'],
    region: [''],
    provincia: [''],
    municipio: [''],
    distrito:[''],
    fuente:[''],
    eje:[''],
    objetivo:[''],
    demanda:[''],
    tecnico:[],
    institucionResponsable:['']

  });

  //Lleno todos los dropsdowns fijos en el inicio
  ngOnInit() {
    // llena supcripcion
    for (let item in Suscripcion) {
      if (isNaN(Number(item))) {
        this.suscripciones.push({ text: item, value: Suscripcion[item] });
      }
    }
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

    // llena Instituciones
    this.dropDownService.getInstituciones().subscribe((InstitucionesFromApi: Iinstitucion[]) => {
      for (let item of InstitucionesFromApi) {
        this.institucionesResponsables.push({ texto: item.Nombre, valor: item.IntitucionId});
      }
    }, (error) => {
      console.error(error);
      this.notFound = true;
    });
  }

  // Todos estos rellenados son mientras tanto habilitamos el API, entonces cambiaran la logica.
  onRegionChange(id: number): void {
    // llena Las provincias de acuerdo a la region
    this.provincias=[];

    this.dropDownService.getProvincias().subscribe((provinciasFromApi: Iprovincia[]) => {
      for (let item of provinciasFromApi) {
        if(item.RegionId == id)
        {
        this.provincias.push({ texto: item.Nombre, valor: item.Key});
        }
      }
      console.log(this.provincias);
    }, (error) => {
      console.error(error);
      this.notFound = true;
    });
  }

  onProvinciaChange(id: number): void {
    // llena Los municipios de acuerdo a la provincia
    this.municipios=[];

    this.dropDownService.getMunicipios().subscribe((municipiosFromApi: Imunicipio[]) => {
      for (let item of municipiosFromApi) {
        if(item.ProviceKey == id)
        {
        this.municipios.push({ texto: item.Nombre, valor: item.Key});
        }
      }
    }, (error) => {
      console.error(error);
      this.notFound = true;
    });

  }

  onMunicipiosChange(id: number): void {
    // llena Los distritos de acuerdo a los municipios
    this.distritosMunicipales=[];

    this.dropDownService.getDistritos().subscribe((distritoFromApi: IdistritoMunicipal[]) => {
      for (let item of distritoFromApi) {
        if(item.MunicipioKey == id)
        {
        this.distritosMunicipales.push({ texto: item.Nombre, valor:item.DistritoKey});
        }
      }
    }, (error) => {
      console.error(error);
      this.notFound = true;
    });

  }

  onEjeChange(id: number): void {
    // llena Los distritos de acuerdo a los municipios
    this.objetivosEnd=[];

    this.dropDownService.getObjetivos().subscribe((objetivosFromApi: IobjetivoEnd[]) => {
      for (let item of objetivosFromApi) {
        if(item.EjeId == id)
        {
        this.objetivosEnd.push({ texto: item.Nombre, valor:item.ObjetivoId});
        }
      }
    }, (error) => {
      console.error(error);
      this.notFound = true;
    });

  }
  //end dropDowns

  //****************************otros metodos******************************* */

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
      username: '',
      password: '',
      suscripcion: Suscripcion.Basica,
      promociones: true
    });
    this.telefonos.controls.splice(0, this.telefonos.length);
  }
}

