import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TecnicosRoutingModule } from './tecnicos-routing.module';
import { ListadoTecnicosComponent } from './listado-tecnicos/listado-tecnicos.component';
import { CrearTecnicoComponent } from './crear-tecnico/crear-tecnico.component';
import { DetalleTecnicosComponent } from './detalle-tecnicos/detalle-tecnicos.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule } from 'ngx-toastr';
import { NgxSpinnerModule } from 'ngx-spinner';


@NgModule({
  declarations: [
    ListadoTecnicosComponent,
    CrearTecnicoComponent,
    DetalleTecnicosComponent
  ],
  imports: [
    CommonModule,
    TecnicosRoutingModule,
    NgxDatatableModule,
    FormsModule,
    HttpClientModule,
    NgxSpinnerModule,
    ReactiveFormsModule,
    NgSelectModule,
    NgbModule,
     ToastrModule
  ]
})
export class TecnicosModule { }
