import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { IcategoriaBeneficiario } from "app/shared/models/iCategoriaBeneficiario";
import { CategoriaBeneficiarioService } from "app/shared/services/mantenimientos/categoria-beneficiario.service";
import { NGXToastrService } from "app/shared/services/ngxtoastr.service";
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: "app-crear-categoria",
  templateUrl: "./crear-categoria.component.html",
  styleUrls: ["./crear-categoria.component.scss"],
  providers: [NGXToastrService],
})
export class CrearCategoriaComponent implements OnInit {
  constructor(
    private formBuilder: FormBuilder,
    private serviceStr: NGXToastrService,
    private categoriaBeneficiarioService: CategoriaBeneficiarioService,
    private route: ActivatedRoute,
    private router: Router,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      if (params.has("Id")) {
        this.getCategoriaBeneficiarioParaEditar(parseInt(params.get("Id")));
        this.typeEdit = true;
      }
    });
    this.mode = this.typeEdit ? "Editar" : "Registrar nueva";
  }

  categoriaBeneficiario: IcategoriaBeneficiario;
  notFound = false;

  mode: string;
  typeEdit: boolean;

  registerForm = this.formBuilder.group({
    nombre: [
      null,
      { validators: [Validators.required, Validators.minLength(5)] },
    ],
    estatus: ["A"],
    id: [0],
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

  //CrudMethods
 /*  guardar(data: any) {
    let categoria:IcategoriaBeneficiario = data;

    if (this.typeEdit) {
      this.categoriaBeneficiarioService.updateCategoria(
        categoria.id,
        categoria
      );
    } else {
      this.categoriaBeneficiarioService.createCategoria(categoria);
    }
  } */

  getCategoriaBeneficiarioParaEditar(Id: number) {
    this.notFound = false;
    this.categoriaBeneficiario = null;

    this.categoriaBeneficiarioService
      .getCategoriaBeneficiariosById(Id)
      .subscribe(
        (categoriaBeneficiarioFromTheAPI: IcategoriaBeneficiario) => {
          this.categoriaBeneficiario = categoriaBeneficiarioFromTheAPI;

          this.registerForm.patchValue({
            id: this.categoriaBeneficiario.id,
            estatus: this.categoriaBeneficiario.estatus,
            nombre: this.categoriaBeneficiario.nombre
          });
        },
        (err: any) => {
          console.error(err);
          this.notFound = true;
        }
      );
  }

  submit() {
    if (!this.registerForm.valid) {
      this.serviceStr.typeError(
        "Alguna regla de validación no se está cumpliendo"
      );
      return;
    }
    const categoriaBeneficiario: any = {
      id: this.id.value,
      estatus: this.estatus.value,
      nombre: this.nombre.value
    };

    console.log(categoriaBeneficiario);

    //this.guardar(categoriaBeneficiario);

    this.spinner.show();

    if (this.typeEdit) {
      categoriaBeneficiario.id = this.categoriaBeneficiario.id;
      this.categoriaBeneficiarioService
        .updateCategoria(categoriaBeneficiario)
        .toPromise()
        .then((res: any) => {
          setTimeout(() => {
            this.serviceStr.typeSuccess("La categoria se actualizó con éxito");
            this.router.navigate(["/mantenimientos","categoria_beneficiarios"]);
            this.spinner.hide();
          }, 1000);
        })
        .catch((err) => {
          console.error(err);
          this.serviceStr.typeError(
            "Ocurrió un error inesperado al guardar la categoria, contacte con Soporte TIC"
          );
          this.spinner.hide();
        });
    } else {
      this.categoriaBeneficiarioService
        .createCategoria(categoriaBeneficiario)
        .toPromise()
        .then((res: any) => {
          setTimeout(() => {
            this.serviceStr.typeSuccess("La categoria se registró con éxito");
            this.router.navigate(["/mantenimientos","categoria_beneficiarios"]);
            this.spinner.hide();
          }, 1000);
        })
        .catch((err) => {
          console.error(err);
          this.serviceStr.typeError(
            "Ocurrió un error inesperado al guardar la categoria, contacte con Soporte TIC"
          );
          this.spinner.hide();
        });
    }

    //this.refrescar();
  }

  refrescar() {
    this.registerForm.reset();
  }
}
