import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CrearTipoComponent } from './crear-tipo/crear-tipo.component';
import { DetalleTipoComponent } from './detalle-tipo/detalle-tipo.component';
import { ListadoTipoComponent } from './listado-tipo/listado-tipo.component';

const routes: Routes = [
  {
    path: '',
    children:
      [
        {
          path: '',
          component: ListadoTipoComponent
        },
        {
          path: 'Create',
          component: CrearTipoComponent
        },
        {
          path: 'Details/:Id',
          component: DetalleTipoComponent
        },
        {
          path: 'Edit/:Id',
          component: CrearTipoComponent
        }
      ]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TipoBeneficiarioRoutingModule { }
