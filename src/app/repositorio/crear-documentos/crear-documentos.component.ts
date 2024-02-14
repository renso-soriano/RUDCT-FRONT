import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from '@angular/router';
import { RandyFileComponent } from 'app/shared/components/randy-file/randy-file.component';
import { IcontactoInstitucional } from 'app/shared/models/iContactoInstitucional.model';
import { IRepositorioAnexo } from 'app/shared/models/irepositorioanexo';
import { DropDownServiceService } from 'app/shared/services/drop-down-service.service';
import { ContactoInsticionalService } from 'app/shared/services/mantenimientos/contacto-institucion.service';
import { NGXToastrService } from 'app/shared/services/ngxtoastr.service';
import { RandyFileService } from 'app/shared/services/randy-file/randy-file.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable } from 'rxjs';
import { RepositorioAnexoService } from '../../shared/services/repositorio.service';
import Archivo from 'app/demandas/interface/archivo.interface';
import { HttpResponse } from '@angular/common/http';


@Component({
  selector: 'app-crear-documentos',
  templateUrl: './crear-documentos.component.html',
  styleUrls: ['./crear-documentos.component.scss']
})
export class CrearDocumentosComponent implements OnInit {
  @ViewChild("randyFile", { static: false }) randyFile: RandyFileComponent
  documentoEvent: Event | undefined;
  fotoEvent: Event | undefined;

  constructor(
    private formBuilder: FormBuilder,
    private serviceStr: NGXToastrService,
    private repositorioanexoService: RepositorioAnexoService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      if (params.has("Id")) {
        this.getDocumentoParaEditar(parseInt(params.get("Id")));
        this.typeEdit = true;
      }
    });
    this.mode = this.typeEdit ? "Editar" : "Registrar nuevo";

  }

  repositorio: IRepositorioAnexo;
  notFound = false;
  institucion: Observable<any[]>;
  mode: string;
  typeEdit: boolean;
  selected: Archivo[] = []

  registerForm = this.formBuilder.group({
    nombre: [ null,{ validators: [Validators.required, Validators.minLength(2)] },],
    documento: [ null,{ validators: [Validators.required, Validators.minLength(2)] },],
    foto: [null],
  });

  //getters
  get id() {
    return this.registerForm.get("id");
  }
  get nombre() {
    return this.registerForm.get("nombre");
  }
  get documento() {
    return this.registerForm.get("documento");
  }
  get foto() {
    return this.registerForm.get("foto");
  }


 guardarDocumento(event: Event) {
    this.documentoEvent = event;
  }

  guardarFoto(event: Event) {
    this.fotoEvent = event;
  }

  // getContactoParaEditar(Id: number) {
  //   this.notFound = false;
  //   this.contacto = null;

  //   this.contactoinstitucionalservice.getContactosInstitucionById(Id).subscribe(
  //     (contactoinstitucionalfromapi: IcontactoInstitucional) => {
  //       this.contacto = contactoinstitucionalfromapi;


  //       this.registerForm.patchValue({
  //         nombre: this.contacto.nombre,
  //         apellido: this.contacto.apellido,
  //         estatus: this.contacto.estatus,
  //         id: this.contacto.id,
  //         funcion:this.contacto.funcion,
  //         telefono: this.contacto.telefono,
  //         extension: this.contacto.extension,
  //         email: this.contacto.email,
  //         institucionId: this.contacto.institucionId,
  //         essectorial:this.contacto.EsSectorial,
  //         direccion:this.contacto.direccion,
  //       });
  //       console.log(this.contacto);
  //     },
  //     (err: any) => {
  //       console.error(err);
  //       this.notFound = true;
  //     }
  //   );
  //   console.log(this.contacto)
  // }


  


  imageSeleted(foto:any){
    console.log(foto.target.files[0], "La foto");
    console.log(this.registerForm.controls['foto'], "la foto control")
    console.log(this.registerForm.controls['documento'], "el documento")

  }

  submit() {
    if (!this.registerForm.valid) {
      this.serviceStr.typeError(
        "Alguna regla de validación no se está cumpliendo"
      );
      return;
    }
    const nombredocumento = this.documento.value.split('\\').pop();
    const nombrefoto = this.foto.value.split('\\').pop();

    const repositorio:IRepositorioAnexo = {
      photoPath: nombrefoto,
      documentPath: nombredocumento,
      documentName: this.nombre.value
    };
    console.log('yo tengo una adiccion, a los repositorio',repositorio);

    this.spinner.show();

    if (this.typeEdit) {
      repositorio.id = this.repositorio.id;
      this.repositorioanexoService
        .updateDocumentosRepositorio(repositorio)
        .toPromise()
        .then((res: any) => {
          setTimeout(() => {
            this.serviceStr.typeSuccess("El documento se actualizó con éxito");
            this.router.navigate(['/repositorio']);
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
      this.repositorioanexoService
        .createDocumentosRepositorio(repositorio)
        .toPromise()
        .then((res: any) => {
          setTimeout(() => {
            this.serviceStr.typeSuccess("El repositorio se registró con éxito");
            this.router.navigate(['/repositorio']);
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
    this.submitDocument()
  }

  refrescar() {
    this.registerForm.reset();
  }
  
  
  
  submitDocument() {
  
  if (!this.documentoEvent && !this.fotoEvent) {
    // No hay archivos para subir
    return;
  }

  const formData = new FormData();

  // Agregar archivos del primer conjunto (this.documentoEvent)
  if (this.documentoEvent) {
    const filesDocumento: FileList | null = (this.documentoEvent.target as HTMLInputElement).files;
    if (filesDocumento && filesDocumento.length > 0) {
      Array.from(filesDocumento).forEach(file => {
        formData.append('ficheros', file);
      });
    }
  }

  // Agregar archivos del segundo conjunto (this.fotoEvent)
  if (this.fotoEvent) {
    const filesFoto: FileList | null = (this.fotoEvent.target as HTMLInputElement).files;
    if (filesFoto && filesFoto.length > 0) {
      Array.from(filesFoto).forEach(file => {
        formData.append('ficheros', file);
      });
    }
  }

  // Imprimir el FormData completo en la consola
  console.log('Contenido del FormData:', formData);

  this.repositorioanexoService.subirDocumentos(formData).subscribe(
    (response) => {
      // Manejar la respuesta del backend si es necesario
      console.log('Documentos subidos con éxito', response);
      this.serviceStr.typeSuccess("Los documentos se han subido correctamente");
    },
    (error) => {
      // Manejar el error si ocurre
      console.error('Error al subir los documentos', error);
      this.serviceStr.typeError("Ocurrió un error al subir los documentos. Por favor, inténtalo de nuevo más tarde.");
    }
  );
}

getDocumentoParaEditar(Id: number) {
  this.notFound = false;
  this.repositorio = null;

  this.repositorioanexoService.getDocumentosRepositorioById(Id).subscribe(
    (contactoinstitucionalfromapi: IRepositorioAnexo) => {
      this.repositorio = contactoinstitucionalfromapi;

      this.registerForm.patchValue({
        nombre: this.repositorio.documentName,
        documento: this.repositorio.documentPath,
        foto: this.repositorio.photoPath
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

