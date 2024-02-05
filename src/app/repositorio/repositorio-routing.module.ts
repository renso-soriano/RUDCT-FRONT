import { ComingSoonPageComponent } from '../pages/content-pages/coming-soon/coming-soon-page.component';
import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoleGuard } from 'app/shared/guards/role.guard';
import { ListadoDocumentosComponent } from './listado-documentos/listado-documentos.component';


const routes: Routes =
[
  {
    path: '',
    children:
    [
      {
        path: '',
        component: ListadoDocumentosComponent
        
      }
    ]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RepositorioRoutingModule { }
