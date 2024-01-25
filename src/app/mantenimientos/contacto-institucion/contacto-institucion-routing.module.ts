import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CrearContactoComponent } from './crear-contacto/crear-contacto.component';
import { DetalleContactoComponent } from './detalle-contacto/detalle-contacto.component';
import { ListadoContactoComponent } from './listado-contacto/listado-contacto.component';

const routes: Routes = [
  {
    path: '',
    children:
      [
        {
          path: '',
          component: ListadoContactoComponent
        },
        {
          path: 'Create',
          component: CrearContactoComponent
        },
        {
          path: 'Details/:Id',
          component: DetalleContactoComponent
        },
        {
          path: 'Edit/:Id',
          component: CrearContactoComponent
        }
      ]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContactoInsticionalRouting { }
