import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListadoDocumentosComponent } from './listado-documentos/listado-documentos.component';
import { ListadoVideosComponent } from './listado-videos/listado-videos.component';
import { RepositorioRoutingModule } from './repositorio-routing.module';
import { SharedModule } from 'app/shared/shared.module';



@NgModule({
  declarations: [
    ListadoDocumentosComponent,
    ListadoVideosComponent
  ],
  imports: [
    CommonModule,
    RepositorioRoutingModule,
    SharedModule
    ]
})
export class RepositorioModule { }
