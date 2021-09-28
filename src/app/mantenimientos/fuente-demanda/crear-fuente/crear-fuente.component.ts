import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IfuenteDemanda } from 'app/shared/models/ifuente-demanda';
import { FuenteService } from 'app/shared/services/mantenimientos/fuente.service';
import { NGXToastrService } from 'app/shared/services/ngxtoastr.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-crear-fuente',
  templateUrl: './crear-fuente.component.html',
  styleUrls: ['./crear-fuente.component.scss'],
  providers: [NGXToastrService]
})
export class CrearFuenteComponent implements OnInit {

  constructor(private formBuilder: FormBuilder,
    private serviceStr: NGXToastrService,
     private fuenteService: FuenteService,
    private route: ActivatedRoute,
    private router: Router,
    private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      if (params.has("FuenteId")) {
        this.getFuenteParaEditar(parseInt(params.get("FuenteId")));
        this.typeEdit = true;
      }
    })
    this.mode = this.typeEdit ? 'Editar' : 'Registrar nueva';

  }

  fuente: IfuenteDemanda;
  notFound = false;

  mode: string;
  typeEdit: boolean;

  registerForm = this.formBuilder.group({
    nombre: [null, { validators: [Validators.required, Validators.minLength(5)] }],
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

  //CrudMethods
  // guardar(fuente: IfuenteDemanda) {
  //   if (this.typeEdit) {
  //     this.fuenteService.updateFuente(fuente.id, fuente);
  //   } else {
  //     this.fuenteService.createFuente(fuente);
  //   }

  // }

  getFuenteParaEditar(FuenteId: number) {
    this.notFound = false;
    this.fuente = null;

    this.fuenteService.getFuenteById(FuenteId).subscribe((fuenteFromTheAPI: IfuenteDemanda) => {
      this.fuente = fuenteFromTheAPI;

      this.registerForm.patchValue({
        nombre: this.fuente.nombre,
        estatus: this.fuente.estatus ,
        id: this.fuente.id
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
    const fuente = {
      id: this.id.value,
      estatus: this.estatus.value,
      nombre: this.nombre.value
    }

    console.log(fuente);

    //this.guardar(fuente);

    this.spinner.show();

    if (this.typeEdit) {
      fuente.id = this.fuente.id;
      this.fuenteService
        .updateFuente(fuente)
        .toPromise()
        .then((res: any) => {
          setTimeout(() => {
            this.serviceStr.typeSuccess("La fuente de demanda se actualizó con éxito");
            this.router.navigate(["/mantenimientos", "fuentes"]);
            this.spinner.hide();
          }, 1000);
        })
        .catch((err) => {
          console.error(err);
          this.serviceStr.typeError(
            "Ocurrió un error inesperado al guardar la fuente de demanda, contacte con Soporte TIC"
          );
          this.spinner.hide();
        });
    } else {
      this.fuenteService
        .createFuente(fuente)
        .toPromise()
        .then((res: any) => {
          setTimeout(() => {
            this.serviceStr.typeSuccess(
              "La fuente de demanda se registró con éxito"
            );
            this.router.navigate(["/mantenimientos", "fuentes"]);
            this.spinner.hide();
          }, 1000);
        })
        .catch((err) => {
          console.error(err);
          this.serviceStr.typeError(
            "Ocurrió un error inesperado al guardar la fuente de demanda, contacte con Soporte TIC"
          );
          this.spinner.hide();
        });
    }

   // this.refrescar();
  }

  refrescar() {

    this.registerForm.reset();

  }

}
