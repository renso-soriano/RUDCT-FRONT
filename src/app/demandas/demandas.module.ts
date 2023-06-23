import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DemandasRoutingModule } from './demandas-routing.module';
import { RegistroDemandasFormComponent } from './registro-demandas-form/registro-demandas-form.component';
import { ListadoDemandasComponent } from './listado-demandas/listado-demandas.component';

import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule } from 'ngx-toastr';
import { DetalleDemandasComponent } from './detalle-demandas/detalle-demandas.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { SharedModule } from 'app/shared/shared.module';
// import { Uploader, UploadWidgetConfig, UploadWidgetResult } from "uploader";
// import { UploaderModule } from "angular-uploader";



@NgModule({
  declarations: [
    RegistroDemandasFormComponent,
    ListadoDemandasComponent,
    DetalleDemandasComponent,

  ],
  imports: [
    CommonModule,
    DemandasRoutingModule,
    NgxDatatableModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgSelectModule,
    NgbModule,
    ToastrModule,
    NgxSpinnerModule,
    SharedModule,
    // UploaderModule

  ],
  exports:[
    DetalleDemandasComponent
  ]
})
export class DemandasModule { }
