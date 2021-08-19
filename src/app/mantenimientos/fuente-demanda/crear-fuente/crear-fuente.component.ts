import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { IfuenteDemanda } from 'app/shared/models/ifuente-demanda';
import { FuenteService } from 'app/shared/services/fuente.service';
import { NGXToastrService } from 'app/shared/services/ngxtoastr.service';

@Component({
  selector: 'app-crear-fuente',
  templateUrl: './crear-fuente.component.html',
  styleUrls: ['./crear-fuente.component.scss'],
  providers: [NGXToastrService]
})
export class CrearFuenteComponent implements OnInit {

  constructor(private formBuilder: FormBuilder,
    private serviceStr: NGXToastrService, private fuenteService: FuenteService) { }

  ngOnInit(): void {
    this.typeEdit = false;
    this.mode = this.typeEdit ? 'Editar' : 'Registar nueva';

  }

  mode: string;
  typeEdit: boolean;

  registerForm = this.formBuilder.group({
    nombre: [null, { validators: [Validators.required, Validators.minLength(5)] }],
    activo: [true],
    FuenteId: [0]
  });

  //getters
  get nombre() {
    return this.registerForm.get('nombre');
  }
  get FuenteId() {
    return this.registerForm.get('FuenteId');
  }
  get activo() {
    return this.registerForm.get('activo');
  }

  //CrudMethods
  guardar(fuente: IfuenteDemanda) {
    if (this.typeEdit) {
      this.fuenteService.updateFuente(fuente.FuenteId, fuente);
    } else {
      this.fuenteService.createFuente(fuente);
    }

  }

  submit() {
    if (!this.registerForm.valid) {
      this.serviceStr.typeError('Alguna regla de validación no se está cumpliendo');
      return;
    }
    const fuente = {
      FuenteId: this.FuenteId.value,
      Nombre: this.nombre.value,
      Activo: this.activo.value
    }

    console.log(fuente);

    //this.guardar(fuente);

    this.refrescar();
  }

  refrescar() {

    this.registerForm.reset();

  }

}
