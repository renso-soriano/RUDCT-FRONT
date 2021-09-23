import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CrearTemaComunComponent } from './crear-tema-comun/crear-tema-comun.component';
import { DetalleTemaComunComponent } from './detalle-tema-comun/detalle-tema-comun.component';
import { ListadoTemaComunComponent } from './listado-tema-comun/listado-tema-comun.component';

const routes: Routes = [
  {
    path: '',
    children:
      [
        {
          path: '',
          component: ListadoTemaComunComponent
        },
        {
          path: 'Create',
          component: CrearTemaComunComponent
        },
        {
          path: 'Details/:Id',
          component: DetalleTemaComunComponent
        },
        {
          path: 'Edit/:Id',
          component: CrearTemaComunComponent
        }
      ]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TemaComunRoutingModule { }
