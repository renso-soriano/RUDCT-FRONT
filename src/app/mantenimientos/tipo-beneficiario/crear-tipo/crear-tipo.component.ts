import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ItipoBeneficiario } from 'app/shared/models/iTipoBeneficiario';
import { NGXToastrService } from 'app/shared/services/ngxtoastr.service';
import { TipoBeneficiarioService } from 'app/shared/services/tipo-beneficiario.service';

@Component({
  selector: 'app-crear-tipo',
  templateUrl: './crear-tipo.component.html',
  styleUrls: ['./crear-tipo.component.scss'],
  providers: [NGXToastrService]
})
export class CrearTipoComponent implements OnInit {


  constructor(private formBuilder: FormBuilder,
    private serviceStr: NGXToastrService,
     private tipoBeneficiarioService: TipoBeneficiarioService,
     private route: ActivatedRoute,
     private router: Router) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      if (params.has("Id")) {
        this.getTipoBeneficiarioParaEditar(parseInt(params.get("Id")));
        this.typeEdit = true;
      }
    })
    this.mode = this.typeEdit ? 'Editar' : 'Registrar nueva';
  }

  tipoBeneficiario: ItipoBeneficiario;
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
  guardar(tipo: ItipoBeneficiario) {
    if (this.typeEdit) {
      this.tipoBeneficiarioService.updateTipo(tipo.Id, tipo);
    } else {
      this.tipoBeneficiarioService.createTipo(tipo);
    }

  }

  getTipoBeneficiarioParaEditar(Id: number) {
    this.notFound = false;
    this.tipoBeneficiario = null;

    this.tipoBeneficiarioService.getTipoBeneficiariosById(Id).subscribe((tipoBeneficiarioFromTheAPI: ItipoBeneficiario[]) => {
      this.tipoBeneficiario = tipoBeneficiarioFromTheAPI[0];

      this.registerForm.patchValue({
        nombre: this.tipoBeneficiario.Nombre,
        activo: this.tipoBeneficiario.Activo == 1 ? true : false,
        InstitucionId: this.tipoBeneficiario.Id
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
    const tipoBeneficiario = {
      Id: this.Id.value,
      Nombre: this.nombre.value,
      Activo: this.activo.value
    }

    console.log(tipoBeneficiario);

    //this.guardar(tipoBeneficiario);

    this.refrescar();
  }

  refrescar() {

    this.registerForm.reset();

  }

}
