import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CategoriaBeneficiarioRoutingModule } from './categoria-beneficiario-routing.module';
import { ListadoCategoriaComponent } from './listado-categoria/listado-categoria.component';
import { CrearCategoriaComponent } from './crear-categoria/crear-categoria.component';
import { DetalleCategoriaComponent } from './detalle-categoria/detalle-categoria.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule } from 'ngx-toastr';
import { NgxSpinnerModule } from 'ngx-spinner';


@NgModule({
  declarations: [
    ListadoCategoriaComponent,
    CrearCategoriaComponent,
    DetalleCategoriaComponent
  ],
  imports: [
    CommonModule,
    CategoriaBeneficiarioRoutingModule,
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
export class CategoriaBeneficiarioModule { }
