import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CrearFuenteComponent } from './crear-fuente/crear-fuente.component';
import { DetalleFuenteComponent } from './detalle-fuente/detalle-fuente.component';
import { ListadoFuenteComponent } from './listado-fuente/listado-fuente.component';

const routes: Routes = [
  {
    path: '',
    children:
      [
        {
          path: '',
          component: ListadoFuenteComponent
        },
        {
          path: 'Create',
          component: CrearFuenteComponent
        },
        {
          path: 'Details/:FuenteId',
          component: DetalleFuenteComponent
        },
        {
          path: 'Edit/:FuenteId',
          component: CrearFuenteComponent
        }
      ]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FuenteDemandaRoutingModule { }
