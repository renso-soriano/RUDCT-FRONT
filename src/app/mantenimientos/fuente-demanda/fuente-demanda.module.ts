import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FuenteDemandaRoutingModule } from './fuente-demanda-routing.module';
import { CrearFuenteComponent } from './crear-fuente/crear-fuente.component';
import { DetalleFuenteComponent } from './detalle-fuente/detalle-fuente.component';
import { ListadoFuenteComponent } from './listado-fuente/listado-fuente.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule } from 'ngx-toastr';
import { NgxSpinnerModule } from 'ngx-spinner';


@NgModule({
  declarations: [
    CrearFuenteComponent,
    DetalleFuenteComponent,
    ListadoFuenteComponent
  ],
  imports: [
    CommonModule,
    FuenteDemandaRoutingModule,
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
export class FuenteDemandaModule { }
