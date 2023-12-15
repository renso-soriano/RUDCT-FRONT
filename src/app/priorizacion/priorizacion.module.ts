import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PriorizacionRoutingModule } from './priorizacion-routing.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule } from 'ngx-toastr';
import { NgxSpinnerModule } from 'ngx-spinner';
import { SharedModule } from 'app/shared/shared.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { ListadoDemandasPriorizacionComponent } from './listado-demandas-priorizacion/listado-demandas-priorizacion.component';
import { DemandasModule } from 'app/demandas/demandas.module';


@NgModule({
  declarations: [ListadoDemandasPriorizacionComponent],
  imports: [
    CommonModule,
    PriorizacionRoutingModule,
    NgxDatatableModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgSelectModule,
    NgbModule,
    ToastrModule,
    NgxSpinnerModule,
    SharedModule,
    DemandasModule
  ]
})
export class PriorizacionModule { }
