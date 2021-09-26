import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IfuenteDemanda } from 'app/shared/models/ifuente-demanda';
import { FuenteService } from 'app/shared/services/mantenimientos/fuente.service';
import { NGXToastrService } from 'app/shared/services/ngxtoastr.service';

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
    private router: Router) { }

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
  guardar(fuente: IfuenteDemanda) {
    if (this.typeEdit) {
      this.fuenteService.updateFuente(fuente.id, fuente);
    } else {
      this.fuenteService.createFuente(fuente);
    }

  }

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
      nombre: this.nombre.value,
      estatus: this.estatus.value
    }

    console.log(fuente);

    //this.guardar(fuente);

    this.refrescar();
  }

  refrescar() {

    this.registerForm.reset();

  }

}
