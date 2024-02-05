import { Component, OnInit, ViewChild } from '@angular/core';
import { IModalConfig } from 'app/shared/components/modal/IModalConfig';
import { IModalOption } from 'app/shared/components/modal/IModalOptions';
import { ModalComponent } from 'app/shared/components/modal/modal.component';
import { RandyFileComponent } from 'app/shared/components/randy-file/randy-file.component';
import { RandyFileService } from 'app/shared/services/randy-file/randy-file.service';

@Component({
  selector: 'app-listado-documentos',
  templateUrl: './listado-documentos.component.html',
  styleUrls: ['./listado-documentos.component.scss']
})
export class ListadoDocumentosComponent implements OnInit {
  @ViewChild("randyFile", { static: false }) randyFile: RandyFileComponent
  @ViewChild("modalFiles") modalFiles: ModalComponent
  isModalOpen: boolean = false;

  constructor(
    private randyFileService: RandyFileService,
  ) { }

  modalConfigFiles: IModalConfig = {
    modalTitle: "Agregar nuevo documento",
  };
  modalOptionFiles: IModalOption = {
    size: "xl",
    centered: true,
  };

  openModal() {
    this.modalFiles.open();
  }
  closeModalSimple() {
    this.isModalOpen = false;
  }

  closeModal() {
    this.submit();
    this.isModalOpen = false;
  }

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

}}
