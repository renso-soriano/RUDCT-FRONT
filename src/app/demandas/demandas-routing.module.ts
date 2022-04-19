import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoleGuard } from 'app/shared/guards/role.guard';
import { DetalleDemandasComponent } from './detalle-demandas/detalle-demandas.component';
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
      },
      {
        path: 'Details/:id',
        component: DetalleDemandasComponent
      },
      {

        path: 'Edit/:id',
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
