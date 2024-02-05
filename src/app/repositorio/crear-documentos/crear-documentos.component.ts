import { Component, OnInit, ViewChild } from '@angular/core';
import { RandyFileComponent } from 'app/shared/components/randy-file/randy-file.component';
import { RandyFileService } from 'app/shared/services/randy-file/randy-file.service';


@Component({
  selector: 'app-crear-documentos',
  templateUrl: './crear-documentos.component.html',
  styleUrls: ['./crear-documentos.component.scss']
})
export class CrearDocumentosComponent implements OnInit {
  @ViewChild("randyFile", { static: false }) randyFile: RandyFileComponent

  constructor(
    private randyFileService: RandyFileService,
  ) { }

  ngOnInit(): void {
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

