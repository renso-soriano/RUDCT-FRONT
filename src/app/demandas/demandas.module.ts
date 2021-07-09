import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DemandasRoutingModule } from './demandas-routing.module';
import { RegistroDemandasFormComponent } from './registro-demandas-form/registro-demandas-form.component';
import { ListadoDemandasComponent } from './listado-demandas/listado-demandas.component';

import { NgxDatatableModule } from '@swimlane/ngx-datatable';


@NgModule({
  declarations: [
    RegistroDemandasFormComponent,
    ListadoDemandasComponent
  ],
  imports: [
    CommonModule,
    DemandasRoutingModule,
    NgxDatatableModule
  ]
})
export class DemandasModule { }
