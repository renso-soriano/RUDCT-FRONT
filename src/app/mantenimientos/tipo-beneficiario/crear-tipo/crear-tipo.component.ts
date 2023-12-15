import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { ItipoBeneficiario } from "app/shared/models/iTipoBeneficiario";
import { NGXToastrService } from "app/shared/services/ngxtoastr.service";
import { TipoBeneficiarioService } from "app/shared/services/mantenimientos/tipo-beneficiario.service";
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: "app-crear-tipo",
  templateUrl: "./crear-tipo.component.html",
  styleUrls: ["./crear-tipo.component.scss"],
  providers: [NGXToastrService],
})
export class CrearTipoComponent implements OnInit {
  constructor(
    private formBuilder: FormBuilder,
    private serviceStr: NGXToastrService,
    private tipoBeneficiarioService: TipoBeneficiarioService,
    private route: ActivatedRoute,
    private router: Router,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      if (params.has("Id")) {
        this.getTipoBeneficiarioParaEditar(parseInt(params.get("Id")));
        this.typeEdit = true;
      }
    });
    this.mode = this.typeEdit ? "Editar" : "Registrar nueva";
  }

  tipoBeneficiario: ItipoBeneficiario;
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


  getTipoBeneficiarioParaEditar(Id: number) {
    this.notFound = false;
    this.tipoBeneficiario = null;

    this.tipoBeneficiarioService.getTipoBeneficiariosById(Id).subscribe(
      (tipoBeneficiarioFromTheAPI: ItipoBeneficiario) => {
        this.tipoBeneficiario = tipoBeneficiarioFromTheAPI;

        this.registerForm.patchValue({
          nombre: this.tipoBeneficiario.nombre,
          estatus: this.tipoBeneficiario.estatus,
          id: this.tipoBeneficiario.id,
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
    const tipoBeneficiario = {
      id: this.id.value,
      estatus: this.estatus.value,
      nombre: this.nombre.value,
    };


    this.spinner.show();

    if (this.typeEdit) {
      tipoBeneficiario.id = this.tipoBeneficiario.id;
      this.tipoBeneficiarioService
        .updateTipo(tipoBeneficiario)
        .toPromise()
        .then((res: any) => {
          setTimeout(() => {
            this.serviceStr.typeSuccess("El tipo se actualizó con éxito");
            this.router.navigate(["/mantenimientos", "tipos_beneficiarios"]);
            this.spinner.hide();
          }, 1000);
        })
        .catch((err) => {
          console.error(err);
          this.serviceStr.typeError(
            "Ocurrió un error inesperado al guardar el tipo de beneficiario, contacte con Soporte TIC"
          );
          this.spinner.hide();
        });
    } else {
      this.tipoBeneficiarioService
        .createTipo(tipoBeneficiario)
        .toPromise()
        .then((res: any) => {
          setTimeout(() => {
            this.serviceStr.typeSuccess(
              "El tipo de beneficiario se registró con éxito"
            );
            this.router.navigate(["/mantenimientos", "tipos_beneficiarios"]);
            this.spinner.hide();
          }, 1000);
        })
        .catch((err) => {
          console.error(err);
          this.serviceStr.typeError(
            "Ocurrió un error inesperado al guardar el tipo de beneficiario, contacte con Soporte TIC"
          );
          this.spinner.hide();
        });
    }


  }



  refrescar() {
    this.registerForm.reset();
  }
}
