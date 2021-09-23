import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IcategoriaBeneficiario } from 'app/shared/models/iCategoriaBeneficiario';
import { CategoriaBeneficiarioService } from 'app/shared/services/mantenimientos/categoria-beneficiario.service';
import { NGXToastrService } from 'app/shared/services/ngxtoastr.service';

@Component({
  selector: 'app-crear-categoria',
  templateUrl: './crear-categoria.component.html',
  styleUrls: ['./crear-categoria.component.scss'],
  providers: [NGXToastrService]
})
export class CrearCategoriaComponent implements OnInit {

  constructor(private formBuilder: FormBuilder,
    private serviceStr: NGXToastrService,
     private categoriaBeneficiarioService: CategoriaBeneficiarioService,
     private route: ActivatedRoute,
     private router: Router) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      if (params.has("Id")) {
        this.getCategoriaBeneficiarioParaEditar(parseInt(params.get("Id")));
        this.typeEdit = true;
      }
    })
    this.mode = this.typeEdit ? 'Editar' : 'Registrar nueva';
  }

  categoriaBeneficiario: IcategoriaBeneficiario;
  notFound = false;

  mode: string;
  typeEdit: boolean;

  registerForm = this.formBuilder.group({
    nombre: [null, { validators: [Validators.required, Validators.minLength(5)] }],
    estatus: ['A'],
    id: [null]
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
  guardar(categoria: IcategoriaBeneficiario) {
    if (this.typeEdit) {
      this.categoriaBeneficiarioService.updateCategoria(categoria.id, categoria);
    } else {
      this.categoriaBeneficiarioService.createCategoria(categoria);
    }

  }

  getCategoriaBeneficiarioParaEditar(Id: number) {
    this.notFound = false;
    this.categoriaBeneficiario = null;

    this.categoriaBeneficiarioService.getCategoriaBeneficiariosById(Id).subscribe((categoriaBeneficiarioFromTheAPI: IcategoriaBeneficiario) => {
      this.categoriaBeneficiario = categoriaBeneficiarioFromTheAPI;

      this.registerForm.patchValue({
        nombre: this.categoriaBeneficiario.nombre,
        estatus: this.categoriaBeneficiario.estatus,
        id: this.categoriaBeneficiario.id
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
    const categoriaBeneficiario = {
      id: this.id.value,
      nombre: this.nombre.value,
      status: this.estatus.value
    }

    console.log(categoriaBeneficiario);

    //this.guardar(categoriaBeneficiario);

    this.refrescar();
  }

  refrescar() {

    this.registerForm.reset();

  }

}
