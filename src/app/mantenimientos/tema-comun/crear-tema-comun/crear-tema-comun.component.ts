import { ItemaComun } from './../../../shared/models/iTemaComun';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ItipoBeneficiario } from 'app/shared/models/iTipoBeneficiario';
import { TemaComunService } from 'app/shared/services/mantenimientos/tema-comun.service';
import { NGXToastrService } from 'app/shared/services/ngxtoastr.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-crear-tema-comun',
  templateUrl: './crear-tema-comun.component.html',
  styleUrls: ['./crear-tema-comun.component.scss'],
  providers: [NGXToastrService]
})
export class CrearTemaComunComponent implements OnInit {


  constructor(private formBuilder: FormBuilder,
    private serviceStr: NGXToastrService,
    private temaComunService: TemaComunService,
    private route: ActivatedRoute,
    private router: Router,
    private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      if (params.has("Id")) {
        this.getTemaComunParaEditar(parseInt(params.get("Id")));
        this.typeEdit = true;
      }
    })
    this.mode = this.typeEdit ? 'Editar' : 'Registrar nuevo';
  }

  temaComun: ItemaComun;
  notFound = false;

  mode: string;
  typeEdit: boolean;

  registerForm = this.formBuilder.group({
    nombre: [null, { validators: [Validators.required, Validators.minLength(5)] }],
    finalidad: [null, { validators: [Validators.required] }],
    funcion: [null, { validators: [Validators.required] }],
    estatus: ['A'],
    id: [0]
  });

  //getters
  get nombre() {
    return this.registerForm.get('nombre');
  }
  get id() {
    return this.registerForm.get('id');
  }
  get estatus() {
    return this.registerForm.get('estatus');
  }
  get finalidad() {
    return this.registerForm.get('finalidad');
  }
  get funcion() {
    return this.registerForm.get('funcion');
  }



  getTemaComunParaEditar(Id: number) {
    this.notFound = false;
    this.temaComun = null;

    this.temaComunService.getTemaComunById(Id).subscribe((temaComunFromTheAPI: ItemaComun) => {
      this.temaComun = temaComunFromTheAPI;

      this.registerForm.patchValue({
        nombre: this.temaComun.nombre,
        estatus: this.temaComun.estatus,
        id: this.temaComun.id,
        finalidad: this.temaComun.finalidad,
        funcion: this.temaComun.funcion,
      });

    }, (err: any) => {
      console.error(err);
      this.notFound = true;
    });
  }

  submit() {
    if (!this.registerForm.valid) {
      this.serviceStr.typeError('Alguna regla de validación no se está cumpliendo');
      return;
    }
    const temaComun = {
      id: this.id.value,
      estatus: this.estatus.value,
      nombre: this.nombre.value,
      finalidad: this.finalidad.value,
      funcion: this.funcion.value
    }

    this.spinner.show();

    if (this.typeEdit) {
      temaComun.id = this.temaComun.id;
      this.temaComunService
        .updateTemaComun(temaComun)
        .toPromise()
        .then((res: any) => {
          setTimeout(() => {
            this.serviceStr.typeSuccess("El tema comun se actualizó con éxito");
            this.router.navigate(["/mantenimientos", "temaComun"]);
            this.spinner.hide();
          }, 1000);
        })
        .catch((err) => {
          console.error(err);
          this.serviceStr.typeError(
            "Ocurrió un error inesperado al guardar el tema comun, contacte con Soporte TIC"
          );
          this.spinner.hide();
        });
    } else {
      this.temaComunService
        .createTemaComun(temaComun)
        .toPromise()
        .then((res: any) => {
          setTimeout(() => {
            this.serviceStr.typeSuccess(
              "El tema comun  se registró con éxito"
            );
            this.router.navigate(["/mantenimientos", "temaComun"]);
            this.spinner.hide();
          }, 1000);
        })
        .catch((err) => {
          console.error(err);
          this.serviceStr.typeError(
            "Ocurrió un error inesperado al guardar el tema comun, contacte con Soporte TIC"
          );
          this.spinner.hide();
        });
    }


  }

  refrescar() {

    this.registerForm.reset();

  }

}
