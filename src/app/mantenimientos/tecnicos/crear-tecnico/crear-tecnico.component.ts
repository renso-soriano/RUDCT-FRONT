import { DropDownServiceService } from "./../../../shared/services/drop-down-service.service";
import { Itecnico } from "./../../../shared/models/itecnico";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { TecnicosService } from "app/shared/services/mantenimientos/tecnicos.service";
import { NGXToastrService } from "app/shared/services/ngxtoastr.service";
import { Observable } from "rxjs";

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
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getProvincias();
    this.route.paramMap.subscribe((params) => {
      if (params.has("Id")) {
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
    estatus: [null, { validators: [Validators.required] }],
    id: [null],
    municipioId: [null],
    telefono: [null, { validators: [Validators.required] }],
    extension: [null],
    flota: [null],
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

  //CrudMethods
  guardar(tecnico: Itecnico) {
    if (this.typeEdit) {
      this.tecnicoService.updateTecnico(tecnico.id, tecnico);
    } else {
      this.tecnicoService.createTecnico(tecnico);
    }
  }

  getTecnicoParaEditar(Id: number) {
    this.notFound = false;
    this.tecnico = null;

    this.tecnicoService.getTecnicosById(Id).subscribe(
      (tecnicoFromTheAPI: Itecnico) => {
        this.tecnico = tecnicoFromTheAPI;

        console.log(this.tecnico);

        this.registerForm.patchValue({
          nombre: this.tecnico.nombre,
          apellido: this.tecnico.apellido,
          estatus: this.tecnico.estatus,
          id: this.tecnico.id,
          municipioId: this.tecnico.municipioId,
          telefono: this.tecnico.telefono,
          extension: this.tecnico.extension,
          flota: this.tecnico.flota,
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
    const tecnico = {
      id: this.id.value,
      status: this.estatus.value,
      municipioId: this.municipioId.value,
      nombre: this.nombre.value,
      apellido: this.apellido.value,
      telefono: this.telefono.value,
      extension: this.extension.value,
      flota: this.flota.value,
    };

    console.log(tecnico);

    //this.guardar(tecnico);

    this.refrescar();
  }

  refrescar() {
    this.registerForm.reset();
  }
}
