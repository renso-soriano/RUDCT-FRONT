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

@Component({
  selector: 'app-registro-demandas-form',
  templateUrl: './registro-demandas-form.component.html',
  styleUrls: ['./registro-demandas-form.component.scss']
})
export class RegistroDemandasFormComponent implements OnInit {

  constructor(private formBuilder: FormBuilder,
    private usernameUnicoService: UsernameUnicoService, private dropDownService: DropDownServiceService) { }

  notFound = false;

   //propiedades

  anios: IDropDown[] = [];
  regiones: IDropDown[] = [];
  provincias: IDropDown[] = [];
  municipios: IDropDown[] = [];
  distritosMunicipales: IDropDown[] = [];
  fuenteDemandas: IDropDown[] = [];
  ejesEnd: IDropDown[] = [];
  objetivosEnd: IDropDown[] = [];
  instituciones: IDropDown[] = [];
  politicas: IDropDown[] = [];
  actividades: IDropDown[] = [];
  tecnicos: IDropDown[] = [];


   //getters


  get comentarios() {
    return this.registerForm.get('comentarios');
  }
  get beneficiariosDirectosFamilias() {
    return this.registerForm.get('beneficiariosDirectosFamilias');
  }
  get beneficiariosDirectosPersonas() {
    return this.registerForm.get('beneficiariosDirectosPersonas');
  }
  get beneficiariosIndirectosFamilias() {
    return this.registerForm.get('beneficiariosIndirectosFamilias');
  }
  get beneficiariosIndirectosPersonas() {
    return this.registerForm.get('beneficiariosIndirectosPersonas');
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

  registerForm = this.formBuilder.group({
    año: ['2018'],
    region: [''],
    provincia: [''],
    municipio: [''],
    distrito: [''],
    fuente: [''],
    eje: [''],
    objetivo: [''],
    demanda: ['', {
      validators: [Validators.required],
      asyncValidators: [this.usernameUnicoService.validate.bind(this.usernameUnicoService)],
      updateOn: 'blur'
    }],
    tecnico: [],
    institucionResponsable: [''],
    institucionesColaboradoras:[''],
    beneficiarios:[''],
    unidad:[''],
    comentarios:[''],
    telefonos: this.formBuilder.array([])
    /* username: ['', {
      validators: [Validators.required],
      asyncValidators: [this.usernameUnicoService.validate.bind(this.usernameUnicoService)],
      updateOn: 'blur'
    }],
    password: ['', {
      validators: [Validators.required, Validators.minLength(4), passwordValidation()]
    }], */
  });

  //Lleno todos los dropsdowns fijos en el inicio
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
        this.politicas.push({ texto: item.Nombre, valor: item.PoliticaId});
      }
    }, (error) => {
      console.error(error);
      this.notFound = true;
    });

  }

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

  agregarPolitica(){
this.politicas.push({ texto: 'prueba', valor: 0 })

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

