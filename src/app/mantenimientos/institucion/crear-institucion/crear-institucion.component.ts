import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NGXToastrService } from 'app/shared/services/ngxtoastr.service';

@Component({
  selector: 'app-crear-institucion',
  templateUrl: './crear-institucion.component.html',
  styleUrls: ['./crear-institucion.component.scss'],
  providers: [NGXToastrService]
})
export class CrearInstitucionComponent implements OnInit {

  constructor(private formBuilder: FormBuilder,
    private serviceStr: NGXToastrService) { }

  ngOnInit(): void {
  }

  registerForm = this.formBuilder.group({
    anio: [null, { validators: [Validators.required] }],
    region: [null, { validators: [Validators.required] }]
  });


  submit() {
    if (!this.registerForm.valid) {
      this.serviceStr.typeError('Alguna regla de validación no se está cumpliendo');
      return;
    }

    console.log(this.registerForm.value);
    this.refrescar();
  }

  refrescar() {

    this.registerForm.reset();

  }

}
