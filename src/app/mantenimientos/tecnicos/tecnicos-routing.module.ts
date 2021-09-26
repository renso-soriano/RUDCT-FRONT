import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CrearTecnicoComponent } from './crear-tecnico/crear-tecnico.component';
import { DetalleTecnicosComponent } from './detalle-tecnicos/detalle-tecnicos.component';
import { ListadoTecnicosComponent } from './listado-tecnicos/listado-tecnicos.component';

const routes: Routes = [
  {
    path: '',
    children:
      [
        {
          path: '',
          component: ListadoTecnicosComponent
        },
        {
          path: 'Create',
          component: CrearTecnicoComponent
        },
        {
          path: 'Details/:Id',
          component: DetalleTecnicosComponent
        },
        {
          path: 'Edit/:Id',
          component: CrearTecnicoComponent
        }
      ]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TecnicosRoutingModule { }
