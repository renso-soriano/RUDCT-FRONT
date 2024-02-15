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
  private tempData = [];
  // row data
  limitSelected: any = 10;
  public rows;
  page = {
    limit: this.limitSelected,
    count: 0,
    offset: 0
  }


  
  async pageCallback(pageInfo: { count?: number; pageSize?: number; limit?: number; offset?: number; }) {
    // Asegúrate de asignar correctamente el offset proporcionado por el evento pageChange
    this.llamarDocumentos(pageInfo); // Llama a llamarDocumentos para actualizar los datos
  }

  onPageChange(pageInfo: { count?: number; pageSize?: number; limit?: number; offset?: number; }) {
    console.log(pageInfo,'eta no ete si'); // Verifica si el objeto pageInfo contiene el valor correcto de offset
    this.pageCallback(pageInfo); // Llama a pageCallback con el objeto pageInfo
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



  llamarDocumentos(pageInfo?) {
    this.repositorioAnexoService.getDocumentosRepositorio(pageInfo, this.limitSelected).subscribe((data: any) => {
      this.page.count = data.total;
      this.rows = data.items;
      this.documentname = [];
      this.photo = []; 
      this.documentpath = []; 
      this.id = [];
      this.tempData = data.items
      this.rows.forEach(item => {
        this.documentname.push(item.documentName);
        this.documentpath.push(`https://localhost:5001/files/${item.documentPath}`); // Asigna el documentpath a cada elemento
        this.photo.push(`https://localhost:5001/files/${item.photoPath}`);
        this.id.push(item.id)
      });
      console.log('Rows',this.rows.length)
    });
  }
  // filterUpdate(event) {
  //   const val = event.target.value.toLowerCase();
  //   // filter our data
  //    const temp = this.tempData.filter(function (d) {
  //      return d.documentName.toLowerCase().indexOf(val) !== -1 || !val;
  //    });
  //   console.log(temp,'roews')

  //   // update the rows
  //   this.rows = temp;
  //   // Whenever the filter changes, always go back to the first page
  //   this.page.offset = 0;
  // }

  

  
  
  }
