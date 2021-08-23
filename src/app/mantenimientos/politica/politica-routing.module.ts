import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CrearPoliticaComponent } from './crear-politica/crear-politica.component';
import { DetallePoliticaComponent } from './detalle-politica/detalle-politica.component';
import { ListadoPoliticaComponent } from './listado-politica/listado-politica.component';

const routes: Routes = [
  {
    path: '',
    children:
      [
        {
          path: '',
          component: ListadoPoliticaComponent
        },
        {
          path: 'Create',
          component: CrearPoliticaComponent
        },
        {
          path: 'Details/:PoliticaId',
          component: DetallePoliticaComponent
        },
        {
          path: 'Edit/:PoliticaId',
          component: CrearPoliticaComponent
        }
      ]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PoliticaRoutingModule { }
