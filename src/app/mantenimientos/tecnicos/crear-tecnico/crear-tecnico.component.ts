import { DropDownServiceService } from "./../../../shared/services/drop-down-service.service";
import { Itecnico } from "./../../../shared/models/itecnico";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { TecnicosService } from "app/shared/services/mantenimientos/tecnicos.service";
import { NGXToastrService } from "app/shared/services/ngxtoastr.service";
import { Observable } from "rxjs";
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: "app-crear-tecnico",
  templateUrl: "./crear-tecnico.component.html",
  styleUrls: ["./crear-tecnico.component.scss"],
  providers: [NGXToastrService],
})
export class CrearTecnicoComponent implements OnInit {
  constructor(
    private formBuilder: FormBuilder,
    private serviceStr: NGXToastrService,
    private tecnicoService: TecnicosService,
    private dropDownService: DropDownServiceService,
    private route: ActivatedRoute,
    private router: Router,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.getProvincias();
    this.tipoTecnicos = this.dropDownService.getTipoTecnicos();
    this.route.paramMap.subscribe((params) => {
      if (params.has("Id")) {
        this.getMunicipios();
        this.getTecnicoParaEditar(parseInt(params.get("Id")));
        this.typeEdit = true;
      }
    });
    this.mode = this.typeEdit ? "Editar" : "Registrar nuevo";
  }

  tecnico: Itecnico;
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
  get municipioId() {
    return this.registerForm.get("municipioId");
  }
  get tipoTecnicoId() {
    return this.registerForm.get("tipoTecnicoId");
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
  get flota() {
    return this.registerForm.get("flota");
  }
  get email() {
    return this.registerForm.get("email");
  }



  getTecnicoParaEditar(Id: number) {
    this.notFound = false;
    this.tecnico = null;

    this.tecnicoService.getTecnicosById(Id).subscribe(
      (tecnicoFromTheAPI: Itecnico) => {
        this.tecnico = tecnicoFromTheAPI;

        console.log(this.tecnico,'bizcochito');

        this.registerForm.patchValue({
          nombre: this.tecnico.nombre,
          apellido: this.tecnico.apellido,
          estatus: this.tecnico.estatus,
          id: this.tecnico.id,
          municipioId: this.tecnico.municipioId.toString(),
          tipoTecnicoId: this.tecnico.tipoTecnicoId.toString(),
          telefono: this.tecnico.telefono,
          extension: this.tecnico.extension,
          flota: this.tecnico.flota,
          email: this.tecnico.email,
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


  getMunicipiosByProvincia(provinciaId: number) {
    this.municipios =
      this.dropDownService.getMunicipiosByProvincia(provinciaId);
    this.municipioId.setValue(null);
  }

  submit() {
    if (!this.registerForm.valid) {
      this.serviceStr.typeError(
        "Alguna regla de validación no se está cumpliendo"
      );
      return;
    }
    const tecnico:Itecnico = {
      id: this.id.value,
      estatus: this.estatus.value,
      municipioId: this.municipioId.value,
      tipoTecnicoId: this.tipoTecnicoId.value,
      nombre: this.nombre.value,
      apellido: this.apellido.value,
      telefono: this.telefono.value,
      extension: this.extension.value,
      flota: this.flota.value,
      email:this.email.value
    };

    this.spinner.show();

    if (this.typeEdit) {
      tecnico.id = this.tecnico.id;
      this.tecnicoService
        .updateTecnico(tecnico)
        .toPromise()
        .then((res: any) => {
          setTimeout(() => {
            this.serviceStr.typeSuccess("El tecnico se actualizó con éxito");
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
      this.tecnicoService
        .createTecnico(tecnico)
        .toPromise()
        .then((res: any) => {
          setTimeout(() => {
            this.serviceStr.typeSuccess("El tecnico  se registró con éxito");
            this.router.navigate(["/mantenimientos", "tecnicos"]);
            this.spinner.hide();
          }, 1000);
        })
        .catch((err) => {
          console.error(err);
          this.serviceStr.typeError(
            "Ocurrió un error inesperado al guardar el tecnico, contacte con Soporte TIC"
          );
          this.spinner.hide();
        });
    }

  }

  refrescar() {
    this.registerForm.reset();
  }
}
