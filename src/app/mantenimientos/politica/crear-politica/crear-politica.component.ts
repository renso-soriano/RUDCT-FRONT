import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Ipolitica } from 'app/shared/models/ipolitica';
import { NGXToastrService } from 'app/shared/services/ngxtoastr.service';
import { PoliticaService } from 'app/shared/services/politica.service';

@Component({
  selector: 'app-crear-politica',
  templateUrl: './crear-politica.component.html',
  styleUrls: ['./crear-politica.component.scss'],
  providers: [NGXToastrService]
})
export class CrearPoliticaComponent implements OnInit {

  constructor(private formBuilder: FormBuilder,
    private serviceStr: NGXToastrService,
     private politicaService: PoliticaService,
     private route: ActivatedRoute,
     private router: Router) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      if (params.has("PoliticaId")) {
        this.getPoliticaParaEditar(parseInt(params.get("PoliticaId")));
        this.typeEdit = true;
      }
    })
    this.mode = this.typeEdit ? 'Editar' : 'Registrar nueva';
  }

  politica: Ipolitica;
  notFound = false;

  mode: string;
  typeEdit: boolean;

  registerForm = this.formBuilder.group({
    nombre: [null, { validators: [Validators.required, Validators.minLength(5)] }],
    activo: [true],
    PoliticaId: [0]
  });

  //getters
  get nombre() {
    return this.registerForm.get('nombre');
  }
  get PoliticaId() {
    return this.registerForm.get('PoliticaId');
  }
  get activo() {
    return this.registerForm.get('activo');
  }

  //CrudMethods
  guardar(politica: Ipolitica) {
    if (this.typeEdit) {
      this.politicaService.updatePolitica(politica.PoliticaId, politica);
    } else {
      this.politicaService.createPolitica(politica);
    }

  }

  getPoliticaParaEditar(PoliticaId: number) {
    this.notFound = false;
    this.politica = null;

    this.politicaService.getPoliticaById(PoliticaId).subscribe((politicasFromTheAPI: Ipolitica[]) => {
      this.politica = politicasFromTheAPI[0];

      this.registerForm.patchValue({
        nombre: this.politica.Nombre,
        activo: this.politica.Activo == 1 ? true : false,
        PoliticaId: this.politica.PoliticaId
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
    const politica = {
      PoliticaId: this.PoliticaId.value,
      Nombre: this.nombre.value,
      Activo: this.activo.value
    }

    console.log(politica);

    //this.guardar(politica);

    this.refrescar();
  }

  refrescar() {

    this.registerForm.reset();

  }

}
