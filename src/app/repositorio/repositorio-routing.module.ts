import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListadoDocumentosComponent } from './listado-documentos/listado-documentos.component';
import { CrearDocumentosComponent } from './crear-documentos/crear-documentos.component';
import { ListadoVideosComponent } from './listado-videos/listado-videos.component';
import { CrearVideosComponent } from './crear-videos/crear-videos.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: ListadoDocumentosComponent
      },
      {
        path: 'Create',
        component: CrearDocumentosComponent
      },
      {
        path: 'Edit/:Id', // Corregido aquí
        component: CrearDocumentosComponent
      },
      {
        path: 'listadovideo',
        component: ListadoVideosComponent
      },
      {
        path: 'Createvideos',
        component: CrearVideosComponent
      },
      {
        path: 'EditVideo/:Id', // Corregido aquí
        component: CrearVideosComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RepositorioRoutingModule { }
