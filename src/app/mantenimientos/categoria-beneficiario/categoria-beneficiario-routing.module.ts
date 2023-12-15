import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CrearCategoriaComponent } from './crear-categoria/crear-categoria.component';
import { DetalleCategoriaComponent } from './detalle-categoria/detalle-categoria.component';
import { ListadoCategoriaComponent } from './listado-categoria/listado-categoria.component';

const routes: Routes = [
  {
    path: '',
    children:
      [
        {
          path: '',
          component: ListadoCategoriaComponent
        },
        {
          path: 'Create',
          component: CrearCategoriaComponent
        },
        {
          path: 'Details/:Id',
          component: DetalleCategoriaComponent
        },
        {
          path: 'Edit/:Id',
          component: CrearCategoriaComponent
        }
      ]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CategoriaBeneficiarioRoutingModule { }
