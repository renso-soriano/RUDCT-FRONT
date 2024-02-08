import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListadoDocumentosComponent } from './listado-documentos/listado-documentos.component';
import { CrearDocumentosComponent } from './crear-documentos/crear-documentos.component';


const routes: Routes = [
  {
    path: '',
    children:
    [
      {
        path: '',
        component: ListadoDocumentosComponent
        
      },
      {
        path: 'Create',
        component: CrearDocumentosComponent
        
      },
      {
        path: 'Edit:/Id',
        component: CrearDocumentosComponent
        
      }
    ]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RepositorioRoutingModule { }
