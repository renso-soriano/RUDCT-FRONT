import { DropDownServiceService } from "./../../../shared/services/drop-down-service.service";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { ContactoInsticionalService } from "app/shared/services/mantenimientos/contacto-institucion.service";
import { NGXToastrService } from "app/shared/services/ngxtoastr.service";
import { Observable } from "rxjs";
import { NgxSpinnerService } from 'ngx-spinner';
import { IcontactoInstitucional } from "app/shared/models/iContactoInstitucional.model";
import { AuthService } from "app/shared/services/core/auth.service";
import { SSOInstitucionService } from '../../../shared/services/mantenimientos/ssoInstituciones.services';
import { InstitucionService } from '../../../shared/services/mantenimientos/institucion.service';

@Component({
  selector: "app-crear-contacto",
  templateUrl: "./crear-contacto.component.html",
  styleUrls: ["./crear-contacto.component.scss"],
  providers: [NGXToastrService],
})
export class CrearContactoComponent implements OnInit {
  constructor(
    private formBuilder: FormBuilder,
    private serviceStr: NGXToastrService,
    private contactoinstitucionalservice: ContactoInsticionalService,
    private dropDownService: DropDownServiceService,
    private route: ActivatedRoute,
    private router: Router,
    private spinner: NgxSpinnerService,
    private authservice: AuthService,
    private InstitucionService: InstitucionService,
  ) {}

  ngOnInit(): void {
    console.log(this.authservice.getInstitucion())
  this.dropDownService.getInstitucionById(this.authservice.getInstitucion()).subscribe(
   data => {
    this.institucionids = data.map(a => a.id)[0];
    this.nombreinstitucion = data.map(a => a.name).join(', ');
    console.log('Quiero ser famoso', data);
    console.log('Quiero ser famoso 2', this.institucionids);
  }) 
    // Move the code that depends on this.institucionids inside the subscription block
    this.route.paramMap.subscribe((params) => {
      if (params.has("Id")) {
        this.getInstitucion();
        this.getContactoParaEditar(parseInt(params.get("Id")));
        this.typeEdit = true;
      }
    });
    
    this.mode = this.typeEdit ? "Editar" : "Registrar nuevo";
  
  error => {
    console.error(error);
  }


  }

  contacto: IcontactoInstitucional;
  notFound = false;
  institucion: Observable<any[]>;
  mode: string;
  typeEdit: boolean;
  institucionids:number
  nombreinstitucion:string

  registerForm = this.formBuilder.group({
    nombre: [ null,{ validators: [Validators.required, Validators.minLength(2)] },],
    apellido: [ null,{ validators: [Validators.required, Validators.minLength(2)] },],
    estatus: ["A"],
    id: [0],
    telefono: [null],
    extension: [null],
    email: [null,  { validators:  [Validators.email] } ],
    funcion: [null ],
    direccion : [null]
  });

  //getters
  get nombre() {
    return this.registerForm.get("nombre");
  }
  get id() {
    return this.registerForm.get("id");
  }
  get estatus() {
    return this.registerForm.get("estatus");
  }
  get apellido() {
    return this.registerForm.get("apellido");
  }
  get telefono() {
    return this.registerForm.get("telefono");
  }
  get extension() {
    return this.registerForm.get("extension");
  }
  get funcion() {
    return this.registerForm.get("funcion");
  }
  get email() {
    return this.registerForm.get("email");
  }
  get direccion() {
    return this.registerForm.get("direccion");
  }  

  get area() {
    return this.registerForm.get("area");
  }  



  getContactoParaEditar(Id: number) {
    this.notFound = false;
    this.contacto = null;

    this.contactoinstitucionalservice.getContactosInstitucionById(Id).subscribe(
      (contactoinstitucionalfromapi: IcontactoInstitucional) => {
        this.contacto = contactoinstitucionalfromapi;


        this.registerForm.patchValue({
          nombre: this.contacto.nombre,
          apellido: this.contacto.apellido,
          estatus: this.contacto.estatus,
          id: this.contacto.id,
          funcion:this.contacto.funcion,
          telefono: this.contacto.telefono,
          extension: this.contacto.extension,
          email: this.contacto.email,
          institucionId: this.contacto.institucionId,
          essectorial:this.contacto.EsSectorial,
          direccion:this.contacto.direccion,
        });
        console.log(this.contacto);
      },
      (err: any) => {
        console.error(err);
        this.notFound = true;
      }
    );
    console.log(this.contacto)
  }


  getInstitucion() {
    this.institucion = this.dropDownService.getInstituciones();
  }

  

  getinstbyid(institucionId: number) {
    this.institucion = this.dropDownService.getInstitucionById(institucionId);
  }

  submit() {
    if (!this.registerForm.valid) {
      this.serviceStr.typeError(
        "Alguna regla de validación no se está cumpliendo"
      );
      return;
    }
    const contacto:IcontactoInstitucional = {
      id: this.id.value,
      estatus: this.estatus.value,
      funcion: this.funcion.value,
      EsSectorial: 1,
      nombre: this.nombre.value,
      apellido: this.apellido.value,
      telefono: this.telefono.value,
      extension: this.extension.value,
      email: this.email.value,
      direccion:this.direccion.value,
      institucionId: this.institucionids,
    };
    console.log('yo tengo una adiccion, a los contactoss',contacto);

    this.spinner.show();

    if (this.typeEdit) {
      contacto.id = this.contacto.id;
      this.contactoinstitucionalservice
        .updateContactosInstitucion(contacto)
        .toPromise()
        .then((res: any) => {
          setTimeout(() => {
            this.serviceStr.typeSuccess("El contacto se actualizó con éxito");
            this.router.navigate(["/mantenimientos", "contactosinstitucionales"]);
            this.spinner.hide();
          }, 1000);
        })
        .catch((err) => {
          console.error(err.message);
          this.serviceStr.typeError(
            "Ocurrió un error inesperado al guardar el tecnico, contacte con Soporte TIC"
          );
          this.spinner.hide();
        });
    } else {
      this.contactoinstitucionalservice
        .createContactosInstitucion(contacto)
        .toPromise()
        .then((res: any) => {
          setTimeout(() => {
            this.serviceStr.typeSuccess("El contacto  se registró con éxito");
            this.router.navigate(["/mantenimientos", "contactosinstitucionales"]);
            this.spinner.hide();
          }, 1000);
        })
        .catch((err) => {
          console.error(err);
          this.serviceStr.typeError(
            "Ocurrió un error inesperado al guardar el contacto, contacte con Soporte TIC"
          );
          this.spinner.hide();
        });
    }

  }

  refrescar() {
    this.registerForm.reset();
  }
}
