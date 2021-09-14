import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Iinstitucion } from 'app/shared/models/iinstitucion';
import { InstitucionService } from 'app/shared/services/institucion.service';
import { NGXToastrService } from 'app/shared/services/ngxtoastr.service';

@Component({
  selector: 'app-crear-institucion',
  templateUrl: './crear-institucion.component.html',
  styleUrls: ['./crear-institucion.component.scss'],
  providers: [NGXToastrService]
})
export class CrearInstitucionComponent implements OnInit {

  constructor(private formBuilder: FormBuilder,
    private serviceStr: NGXToastrService,
    private institucionService: InstitucionService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      if (params.has("InstitucionId")) {
        this.getInstitucionParaEditar(parseInt(params.get("InstitucionId")));
        this.typeEdit = true;
      }
    })
    this.mode = this.typeEdit ? 'Editar' : 'Registrar nueva';
  }

  institucion: Iinstitucion;
  notFound = false;

  mode: string;
  typeEdit = false;

  registerForm = this.formBuilder.group({
    nombre: [null, { validators: [Validators.required, Validators.minLength(5)] }],
    activo: [true],
    InstitucionId: [0]
  });

  //getters
  get nombre() {
    return this.registerForm.get('nombre');
  }
  get InstitucionId() {
    return this.registerForm.get('InstitucionId');
  }
  get activo() {
    return this.registerForm.get('activo');
  }

  //CrudMethods
  guardar(institucion: Iinstitucion) {
    if (this.typeEdit) {
      this.institucionService.updateInstitucion(institucion.InstitucionId, institucion);
    } else {
      this.institucionService.createInstitucion(institucion);
    }

  }

  getInstitucionParaEditar(InstitucionId: number) {
    this.notFound = false;
    this.institucion = null;

    this.institucionService.getInstitucionById(InstitucionId).subscribe((institucionFromTheAPI: Iinstitucion[]) => {
      this.institucion = institucionFromTheAPI[0];

      this.registerForm.patchValue({
        nombre: this.institucion.Nombre,
        activo: this.institucion.Activo == 1 ? true : false,
        InstitucionId: this.institucion.InstitucionId
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
    const institucionToSend = {
      InstitucionId: this.InstitucionId.value,
      Nombre: this.nombre.value,
      Activo: this.activo.value
    }

    console.log(institucionToSend);

    //this.guardar(institucionToSend);

    this.refrescar();
  }

  refrescar() {

    this.registerForm.reset();

  }

}
