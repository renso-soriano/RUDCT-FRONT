import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from "@angular/forms";
import { Router } from '@angular/router';
import { RandyFileComponent } from 'app/shared/components/randy-file/randy-file.component';
import { IcontactoInstitucional } from 'app/shared/models/iContactoInstitucional.model';
import { DropDownServiceService } from 'app/shared/services/drop-down-service.service';
import { ContactoInsticionalService } from 'app/shared/services/mantenimientos/contacto-institucion.service';
import { NGXToastrService } from 'app/shared/services/ngxtoastr.service';
import { RandyFileService } from 'app/shared/services/randy-file/randy-file.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-crear-documentos',
  templateUrl: './crear-documentos.component.html',
  styleUrls: ['./crear-documentos.component.scss']
})
export class CrearDocumentosComponent implements OnInit {
  @ViewChild("randyFile", { static: false }) randyFile: RandyFileComponent

  constructor(
    private randyFileService: RandyFileService,
    private formBuilder: FormBuilder,
    private serviceStr: NGXToastrService,
    private contactoinstitucionalservice: ContactoInsticionalService,
    private dropDownService: DropDownServiceService,
    private router: Router,
    private spinner: NgxSpinnerService,
  ) { }

  ngOnInit(): void {
  }

  contacto: IcontactoInstitucional;
  notFound = false;
  institucion: Observable<any[]>;
  mode: string;
  typeEdit: boolean;
  institucionids:number
  nombreinstitucion:string

  registerForm = this.formBuilder.group({
    nombre: [ null,{ validators: [Validators.required, Validators.minLength(2)] },],
    documento: [ null,{ validators: [Validators.required, Validators.minLength(2)] },],
    foto: [null],
  });

  //getters
  get nombre() {
    return this.registerForm.get("nombre");
  }
  get documento() {
    return this.registerForm.get("documento");
  }
  get foto() {
    return this.registerForm.get("foto");
  }



  getContactoParaEditar(Id: number) {
    this.notFound = false;
    this.contacto = null;

    this.contactoinstitucionalservice.getContactosInstitucionById(Id).subscribe(
      (contactoinstitucionalfromapi: IcontactoInstitucional) => {
        this.contacto = contactoinstitucionalfromapi;


        this.registerForm.patchValue({
          nombre: this.contacto.nombre,
          apellido: this.contacto.apellido,
          estatus: this.contacto.estatus,
          id: this.contacto.id,
          funcion:this.contacto.funcion,
          telefono: this.contacto.telefono,
          extension: this.contacto.extension,
          email: this.contacto.email,
          institucionId: this.contacto.institucionId,
          essectorial:this.contacto.EsSectorial,
          direccion:this.contacto.direccion,
        });
        console.log(this.contacto);
      },
      (err: any) => {
        console.error(err);
        this.notFound = true;
      }
    );
    console.log(this.contacto)
  }


  getInstitucion() {
    this.institucion = this.dropDownService.getInstituciones();
  }

  

  getinstbyid(institucionId: number) {
    this.institucion = this.dropDownService.getInstitucionById(institucionId);
  }
  
  imageSeleted(foto:any){
    console.log(foto.target.files[0], "La foto");
    console.log(this.registerForm.controls['foto'], "la foto ")
  }

  submit() {
    // if (!this.registerForm.valid) {
    //   this.serviceStr.typeError(
    //     "Alguna regla de validación no se está cumpliendo"
    //   );
    //   return;
    // }
    // const contacto:IcontactoInstitucional = {
    //   id: this.id.value,
    //   estatus: this.estatus.value,
    //   funcion: this.funcion.value,
    //   EsSectorial: 1,
    //   nombre: this.nombre.value,
    //   apellido: this.apellido.value,
    //   telefono: this.telefono.value,
    //   extension: this.extension.value,
    //   email: this.email.value,
    //   direccion:this.direccion.value,
    //   institucionId: this.institucionids,
    // };
    // console.log('yo tengo una adiccion, a los contactoss',contacto);

    // this.spinner.show();

    // if (this.typeEdit) {
    //   contacto.id = this.contacto.id;
    //   this.contactoinstitucionalservice
    //     .updateContactosInstitucion(contacto)
    //     .toPromise()
    //     .then((res: any) => {
    //       setTimeout(() => {
    //         this.serviceStr.typeSuccess("El contacto se actualizó con éxito");
    //         this.router.navigate(["/mantenimientos", "contactosinstitucionales"]);
    //         this.spinner.hide();
    //       }, 1000);
    //     })
    //     .catch((err) => {
    //       console.error(err.message);
    //       this.serviceStr.typeError(
    //         "Ocurrió un error inesperado al guardar el tecnico, contacte con Soporte TIC"
    //       );
    //       this.spinner.hide();
    //     });
    // } else {
    //   this.contactoinstitucionalservice
    //     .createContactosInstitucion(contacto)
    //     .toPromise()
    //     .then((res: any) => {
    //       setTimeout(() => {
    //         this.serviceStr.typeSuccess("El contacto  se registró con éxito");
    //         this.router.navigate(["/mantenimientos", "contactosinstitucionales"]);
    //         this.spinner.hide();
    //       }, 1000);
    //     })
    //     .catch((err) => {
    //       console.error(err);
    //       this.serviceStr.typeError(
    //         "Ocurrió un error inesperado al guardar el contacto, contacte con Soporte TIC"
    //       );
    //       this.spinner.hide();
    //     });
    // }

  }

  refrescar() {
    this.registerForm.reset();
  }
  mapFile() {
    //  let file = this.listaDeAnexos;
    // this.demanda.demandaAnexos.forEach((item: any) => {
    //   this.files.push({
    //     file: {
    //       ...item?.file,
    //     },
    //     tipoDocumentoId: item.file.fileType.id.toString(),
    //     id: item.id,
    //     entityId: item?.demandaId,
    //     institucionNombre: item?.institucionNombre,
    //     institucionId: item?.institucionId,
    //   });
    // });
  }
  
   async enviar(params) {
    let files = this.randyFile?.getFiles();
    if (files?.length > 0) {
      let formData = this.randyFileService.createFormData(files);
      let fileIds = await this.randyFileService
      .uploadFiles(formData)
      .toPromise();
          fileIds.forEach((fileId) => {
            // this.demanda.demandaAnexos.push({
            //   demandaId: this.demanda.id,
            //   fileId,
            //   id: 0,
            //   institucionId: this.institucionUsuarioEnRUDT
            // });
          });
    }
  }
 
















  

}

