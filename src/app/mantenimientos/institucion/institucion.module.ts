import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InstitucionRoutingModule } from './institucion-routing.module';
import { ListadoInstitucionComponent } from './listado-institucion/listado-institucion.component';
import { CrearInstitucionComponent } from './crear-institucion/crear-institucion.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule } from 'ngx-toastr';
import { DetalleInstitucionComponent } from './detalle-institucion/detalle-institucion.component';


@NgModule({
  declarations: [
    ListadoInstitucionComponent,
    CrearInstitucionComponent,
    DetalleInstitucionComponent
  ],
  imports: [
    CommonModule,
    InstitucionRoutingModule,
    NgxDatatableModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgSelectModule,
    NgbModule,
     ToastrModule
  ]
})
export class InstitucionModule { }
