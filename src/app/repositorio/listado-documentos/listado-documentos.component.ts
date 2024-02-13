import { Component, OnInit, ViewChild } from '@angular/core';
import { IModalConfig } from 'app/shared/components/modal/IModalConfig';
import { IModalOption } from 'app/shared/components/modal/IModalOptions';
import { ModalComponent } from 'app/shared/components/modal/modal.component';
import { RandyFileComponent } from 'app/shared/components/randy-file/randy-file.component';
import { RepositorioAnexoService } from '../../shared/services/repositorio.service';
import { Router } from '@angular/router';
import * as alertFunctions from "../../../app/shared/data/sweet-alerts";

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
    private repositorioAnexoService: RepositorioAnexoService,
    private router: Router

  ) { }

  public photo: any
  public documentname: any
  public documentpath: any
  public id: number[]

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
    this.isModalOpen = false;
  }

  ngOnInit(): void {
    this.llamarDocumentos()
   }

   editar(Id: string) {
    this.router.navigate(["/repositorio/Edit/",Id]);
  }
  eliminar(id: string) {
    alertFunctions.EliminarRegistro("/repositorio",this.repositorioAnexoService.deleteDocumentosRepositorio(id));
  }




  llamarDocumentos() {
  this.repositorioAnexoService.getDocumentosRepositorio().subscribe(
      data => {
        this.documentname = data.map(a=>a.documentName)
        this.documentpath = data.map(a=>'https://localhost:5001/files/' + a.documentPath)
        this.photo = data.map(a=>'https://localhost:5001/files/' + a.photoPath)
        this.id = data.map(a=>a.id)
        console.log('se murio yorch',this.photo)
        console.log('se murio yorch 2',this.documentname)


   },
   error => {
        console.error('Error al obtener los documentos del repositorio:', error);
      }
    );
  }
  
  }
