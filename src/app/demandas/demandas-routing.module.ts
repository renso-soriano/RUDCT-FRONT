import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListadoDemandasComponent } from './listado-demandas/listado-demandas.component';
import { RegistroDemandasFormComponent } from './registro-demandas-form/registro-demandas-form.component';


const routes: Routes =
[
  {
    path: '',
    children:
    [
      {
        path: '',
        component: ListadoDemandasComponent
      },
      {
        path: 'registroDemandas',
        component: RegistroDemandasFormComponent
      }
    ]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DemandasRoutingModule { }
