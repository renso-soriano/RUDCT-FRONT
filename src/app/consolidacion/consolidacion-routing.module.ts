import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListadoDemandasConsolidacionComponent } from './listado-demandas-consolidacion/listado-demandas-consolidacion.component';

const routes: Routes =
[
  {
    path: '',
    children:
    [
      {
        path: '',
        component: ListadoDemandasConsolidacionComponent
      },
      // {
      //   path: 'registroDemandas',
      //   component: RegistroDemandasFormComponent
      // },
      // {
      //   path: 'Details/:id',
      //   component: DetalleDemandasComponent
      // },
      // {
      //   path: 'Edit/:id',
      //   component: RegistroDemandasFormComponent
      // }
    ]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConsolidacionRoutingModule { }
