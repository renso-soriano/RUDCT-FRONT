import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConsolidacionRoutingModule } from './consolidacion-routing.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule } from 'ngx-toastr';
import { NgxSpinnerModule } from 'ngx-spinner';
import { SharedModule } from 'app/shared/shared.module';
import { ListadoDemandasConsolidacionComponent } from './listado-demandas-consolidacion/listado-demandas-consolidacion.component';
import { DemandasModule } from 'app/demandas/demandas.module';


@NgModule({
  declarations: [ListadoDemandasConsolidacionComponent,],
  imports: [
    CommonModule,
    ConsolidacionRoutingModule,
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
export class ConsolidacionModule { }
