import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TipoBeneficiarioRoutingModule } from './tipo-beneficiario-routing.module';
import { ListadoTipoComponent } from './listado-tipo/listado-tipo.component';
import { CrearTipoComponent } from './crear-tipo/crear-tipo.component';
import { DetalleTipoComponent } from './detalle-tipo/detalle-tipo.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule } from 'ngx-toastr';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxSpinnerModule } from 'ngx-spinner';


@NgModule({
  declarations: [
    ListadoTipoComponent,
    CrearTipoComponent,
    DetalleTipoComponent
  ],
  imports: [
    CommonModule,
    TipoBeneficiarioRoutingModule,
    NgxDatatableModule,
    FormsModule,
    NgxSpinnerModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgSelectModule,
    NgbModule,
     ToastrModule
  ]
})
export class TipoBeneficiarioModule { }
