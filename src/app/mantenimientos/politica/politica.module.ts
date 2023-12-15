import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PoliticaRoutingModule } from './politica-routing.module';
import { ListadoPoliticaComponent } from './listado-politica/listado-politica.component';
import { CrearPoliticaComponent } from './crear-politica/crear-politica.component';
import { DetallePoliticaComponent } from './detalle-politica/detalle-politica.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule } from 'ngx-toastr';
import { NgxSpinnerModule } from 'ngx-spinner';


@NgModule({
  declarations: [
    ListadoPoliticaComponent,
    CrearPoliticaComponent,
    DetallePoliticaComponent
  ],
  imports: [
    CommonModule,
    PoliticaRoutingModule,
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
export class PoliticaModule { }
