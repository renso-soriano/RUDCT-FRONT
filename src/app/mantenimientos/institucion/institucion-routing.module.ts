import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CrearInstitucionComponent } from './crear-institucion/crear-institucion.component';
import { DetalleInstitucionComponent } from './detalle-institucion/detalle-institucion.component';
import { ListadoInstitucionComponent } from './listado-institucion/listado-institucion.component';

const routes: Routes = [
  {
    path: '',
    children:
      [
        {
          path: '',
          component: ListadoInstitucionComponent
        },
        {
          path: 'Create',
          component: CrearInstitucionComponent
        },
        {
          path: 'Details/:InstitucionId',
          component: DetalleInstitucionComponent
        }
      ]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InstitucionRoutingModule { }
