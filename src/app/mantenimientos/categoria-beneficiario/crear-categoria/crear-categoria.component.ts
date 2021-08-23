import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IcategoriaBeneficiario } from 'app/shared/models/iCategoriaBeneficiario';
import { CategoriaBeneficiarioService } from 'app/shared/services/categoria-beneficiario.service';
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
    activo: [true],
    Id: [0]
  });

  //getters
  get nombre() {
    return this.registerForm.get('nombre');
  }
  get Id() {
    return this.registerForm.get('Id');
  }
  get activo() {
    return this.registerForm.get('activo');
  }

  //CrudMethods
  guardar(tipo: IcategoriaBeneficiario) {
    if (this.typeEdit) {
      this.categoriaBeneficiarioService.updateTipo(tipo.Id, tipo);
    } else {
      this.categoriaBeneficiarioService.createTipo(tipo);
    }

  }

  getCategoriaBeneficiarioParaEditar(Id: number) {
    this.notFound = false;
    this.categoriaBeneficiario = null;

    this.categoriaBeneficiarioService.getCategoriaBeneficiariosById(Id).subscribe((categoriaBeneficiarioFromTheAPI: IcategoriaBeneficiario[]) => {
      this.categoriaBeneficiario = categoriaBeneficiarioFromTheAPI[0];

      this.registerForm.patchValue({
        nombre: this.categoriaBeneficiario.Nombre,
        activo: this.categoriaBeneficiario.Activo == 1 ? true : false,
        InstitucionId: this.categoriaBeneficiario.Id
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
      Id: this.Id.value,
      Nombre: this.nombre.value,
      Activo: this.activo.value
    }

    console.log(categoriaBeneficiario);

    //this.guardar(tipoBeneficiario);

    this.refrescar();
  }

  refrescar() {

    this.registerForm.reset();

  }

}
