import { ItemaComun } from './../../../shared/models/iTemaComun';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ItipoBeneficiario } from 'app/shared/models/iTipoBeneficiario';
import { TemaComunService } from 'app/shared/services/mantenimientos/tema-comun.service';
import { NGXToastrService } from 'app/shared/services/ngxtoastr.service';

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
     private router: Router) { }

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
  guardar(tema: ItemaComun) {
    if (this.typeEdit) {
      this.temaComunService.updateTemaComun(tema.id, tema);
    } else {
      this.temaComunService.createTemaComun(tema);
    }

  }

  getTemaComunParaEditar(Id: number) {
    this.notFound = false;
    this.temaComun = null;

    this.temaComunService.getTemaComunById(Id).subscribe((temaComunFromTheAPI: ItemaComun) => {
      this.temaComun = temaComunFromTheAPI;

      this.registerForm.patchValue({
        nombre: this.temaComun.nombre,
        estatus: this.temaComun.estatus,
        id: this.temaComun.id
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
    const temacomun = {
      id: this.id.value,
      estatus: this.estatus.value,
      nombre: this.nombre.value
    }

    console.log(temacomun);

    this.guardar(temacomun);

    this.refrescar();
  }

  refrescar() {

    this.registerForm.reset();

  }

}
