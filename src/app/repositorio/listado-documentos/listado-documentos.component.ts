import { Component, OnInit, ViewChild } from '@angular/core';
import { IModalConfig } from 'app/shared/components/modal/IModalConfig';
import { IModalOption } from 'app/shared/components/modal/IModalOptions';
import { ModalComponent } from 'app/shared/components/modal/modal.component';
import { RandyFileComponent } from 'app/shared/components/randy-file/randy-file.component';
import { RepositorioAnexoService } from '../../shared/services/repositorio.service';
import { Router } from '@angular/router';
import * as alertFunctions from "../../../app/shared/data/sweet-alerts";
import { IRepositorioAnexo } from 'app/shared/models/irepositorioanexo';

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
  public photo: string[] = []
  public documentname: string[] = []
  public documentpath: any
  public id: number[]
  // row data
  limitSelected: any = 10;
  public rows;

  page = {
    limit: this.limitSelected,
    count: 0,
    offset: 10
  }

  async pageCallback(pageInfo: {
    count?: number;
    pageSize?: number;
    limit?: number;
    offset?: number;
  }) {
    this.page.offset = pageInfo.offset;
    //console.log("reloadTable en pageCallBack")
  }
  
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
  this.repositorioAnexoService.getDocumentosRepositorio().subscribe((data:any) => {
        // this.documentname = data.map(a=>a.items.documentName)
        // this.documentpath = data.map(a=>'https://localhost:5001/files/' + a.documentPath)
        // this.photo = data.map(a=>'https://localhost:5001/files/' + a.photoPath)
        // this.id = data.map(a=>a.id)
        // console.log('se murio yorch',this.photo)
        // console.log('se murio yorch 2',data.items)
        this.page.count = data.total;
        this.rows = data.items;
         console.log(this.rows)
        this.rows.map(item =>{
          this.documentname.push(item.documentName)
          this.documentpath = (`https://localhost:5001/files/${item.documentPath}`)
          this.photo.push(`https://localhost:5001/files/${item.photoPath}`)
          console.log(item,'esta es la sd')
        console.log(this.page.count,'cuenta')

        })
   })
  }
  
  }
