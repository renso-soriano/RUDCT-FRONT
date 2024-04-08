import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from '@angular/router';
import { DropDownServiceService } from 'app/shared/services/drop-down-service.service';
import { NGXToastrService } from 'app/shared/services/ngxtoastr.service';
import { RandyFileService } from 'app/shared/services/randy-file/randy-file.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { IRepositorioVideo } from 'app/shared/models/irepositoriovideo';
import { RepositorioVideoService } from '../../shared/services/mantenimientos/repositoriovideo.service';

@Component({
  selector: 'app-crear-videos',
  templateUrl: './crear-videos.component.html',
  styleUrls: ['./crear-videos.component.scss']
})
export class CrearVideosComponent implements OnInit {
  typeEdit: boolean;
  notFound: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private serviceStr: NGXToastrService,
    private RepositorioVideoService: RepositorioVideoService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute,

  ) { }
  registerForm = this.formBuilder.group({
    nombre: [ null,{ validators: [Validators.required, Validators.minLength(10)] },],
    enlace: [ null,{ validators: [Validators.required, Validators.minLength(15)] },],
  });
  repositorio: IRepositorioVideo;

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      if (params.has("Id")) {
        this.getVideoParaEditar(parseInt(params.get("Id")));
        this.typeEdit = true;
      }
    });
    this.mode = this.typeEdit ? "Editar" : "Registrar nuevo";

  }
  mode: string;

  get id() {
    return this.registerForm.get("id");
  }
  get nombre() {
    return this.registerForm.get("nombre");
  }
  get enlace() {
    return this.registerForm.get("enlace");
  }

  submit() {
    if (!this.registerForm.valid) {
      this.serviceStr.typeError(
        "Alguna regla de validación no se está cumpliendo"
      );
      return;
    }


    const repositoriovideo:IRepositorioVideo = {
      nombre: this.nombre.value,
      enlace: this.enlace.value,
    };
    console.log('yo tengo una adiccion, a los repositorio',repositoriovideo);

    this.spinner.show();

    if (this.typeEdit) {
      repositoriovideo.id = this.repositorio.id;
      this.RepositorioVideoService
      .updateRepositorioVideo(repositoriovideo)
        .toPromise()
        .then((res: any) => {
          setTimeout(() => {
            this.serviceStr.typeSuccess("El Video se actualizó con éxito");
            this.router.navigate(['/repositorio/listadovideo']);
            this.spinner.hide();
          }, 1000);
        })
        .catch((err) => {
          console.error(err.message);
          this.serviceStr.typeError(
            "Ocurrió un error inesperado al guardar el tecnico, contacte con Soporte TIC"
          );
          this.spinner.hide();
        });
    } else {
      this.RepositorioVideoService
        .createRepositorioVideo(repositoriovideo)
        .toPromise()
        .then((res: any) => {
          setTimeout(() => {
            this.serviceStr.typeSuccess("El Video se registró con éxito");
            this.router.navigate(['/repositorio/listadovideo']);
            this.spinner.hide();
          }, 1000);
        })
        .catch((err) => {
          console.error(err);
          this.serviceStr.typeError(
            "Ocurrió un error inesperado al guardar el contacto, contacte con Soporte TIC"
          );
          this.spinner.hide();
        });
    }
  }

  getVideoParaEditar(Id: number) {
    this.notFound = false;
    this.repositorio = null;

    this.RepositorioVideoService.getRepositorioVideoById(Id).subscribe(
      (contactoinstitucionalfromapi: IRepositorioVideo) => {
        this.repositorio = contactoinstitucionalfromapi;

        this.registerForm.patchValue({
          nombre: this.repositorio.nombre,
          enlace: this.repositorio.enlace
        });
        console.log(this.repositorio);
      },
      (err: any) => {
        console.error(err);
        this.notFound = true;
      }
    );
    console.log(this.repositorio)
  }



}
