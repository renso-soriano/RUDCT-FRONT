import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListadoDemandasPriorizacionComponent } from './listado-demandas-priorizacion/listado-demandas-priorizacion.component';

const routes: Routes =
[
  {
    path: '',
    children:
    [
      {
        path: '',
        component: ListadoDemandasPriorizacionComponent
      }

    ]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PriorizacionRoutingModule { }
