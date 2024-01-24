import { DropDownServiceService } from "./../../../shared/services/drop-down-service.service";
import { Itecnico } from "./../../../shared/models/itecnico";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { ContactoInsticionalService } from "app/shared/services/mantenimientos/contacto-institucion.service";
import { NGXToastrService } from "app/shared/services/ngxtoastr.service";
import { Observable } from "rxjs";
import { NgxSpinnerService } from "ngx-spinner";
import { IcontanctoInstitucional } from "app/shared/models/iContactoInstitucional.model";

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
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.tipoTecnicos = this.dropDownService.getTipoTecnicos();
    this.route.paramMap.subscribe((params) => {
      if (params.has("Id")) {
        this.getMunicipios();
        this.getContactoParaEditar(parseInt(params.get("Id")));
        this.typeEdit = true;
      }
    });
    this.mode = this.typeEdit ? "Editar" : "Registrar nuevo";
  }

  contacto: IcontanctoInstitucional;
  notFound = false;
  provincias: Observable<any[]>;
  municipios: Observable<any[]>;
  tipoTecnicos: Observable<any[]>;

  mode: string;
  typeEdit: boolean;

  registerForm = this.formBuilder.group({
    nombre: [
      null,
      { validators: [Validators.required, Validators.minLength(2)] },
    ],
    apellido: [
      null,
      { validators: [Validators.required, Validators.minLength(2)] },
    ],
    estatus: ["A"],
    id: [0],
    municipioId: [null],
    telefono: [null, { validators: [Validators.required] }],
    extension: [null],
    flota: [null,  { validators:  [Validators.minLength(10)] } ],
    email: [null,  { validators:  [Validators.email] } ],
    tipoTecnicoId:[null, { validators: [Validators.required] }],
    provincia: [null],
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
  get institucionId() {
    return this.registerForm.get("institucionId");
  }
  get esinstitucional() {
    return this.registerForm.get("esinstitucional");
  }
  get provincia() {
    return this.registerForm.get("provincia");
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



  getContactoParaEditar(Id: number) {
    this.notFound = false;
    this.contacto = null;

    this.contactoinstitucionalservice.getContactosInstitucionById(Id).subscribe(
      (contactoinstitucionalfromapi: IcontanctoInstitucional) => {
        this.contacto = contactoinstitucionalfromapi;

        console.log(this.contacto);

        this.registerForm.patchValue({
          nombre: this.contacto.nombre,
          apellido: this.contacto.apellido,
          estatus: this.contacto.estatus,
          id: this.contacto.id,
          funcion:this.funcion,
          telefono: this.contacto.telefono,
          extension: this.contacto.extension,
          email: this.contacto.email,
          esinstitucional:this.esinstitucional
        });
      },
      (err: any) => {
        console.error(err);
        this.notFound = true;
      }
    );
  }

  getProvincias() {
    this.provincias = this.dropDownService.getProvincias();
  }
  getMunicipios() {
    this.municipios = this.dropDownService.getMunicipios();
  }


//  getMunicipiosByProvincia(provinciaId: number) {
//    this.municipios =
//      this.dropDownService.getMunicipiosByProvincia(provinciaId);
//    this.municipioId.setValue(null);
//  }

  submit() {
    if (!this.registerForm.valid) {
      this.serviceStr.typeError(
        "Alguna regla de validación no se está cumpliendo"
      );
      return;
    }
    const contacto:IcontanctoInstitucional = {
      id: this.id.value,
      estatus: this.estatus.value,
      funcion: this.funcion.value,
      esinstitucional: this.esinstitucional.value,
      nombre: this.nombre.value,
      apellido: this.apellido.value,
      telefono: this.telefono.value,
      extension: this.extension.value,
      email: this.email.value,
      institucionId: this.institucionId.value
    };

    this.spinner.show();

    if (this.typeEdit) {
      contacto.id = this.contacto.id;
      this.contactoinstitucionalservice
        .updateContactosInstitucion(contacto)
        .toPromise()
        .then((res: any) => {
          setTimeout(() => {
            this.serviceStr.typeSuccess("El contacto se actualizó con éxito");
            this.router.navigate(["/mantenimientos", "tecnicos"]);
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
            this.router.navigate(["/mantenimientos", "tecnicos"]);
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
