import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DemandasRoutingModule } from './demandas-routing.module';
import { RegistroDemandasFormComponent } from './registro-demandas-form/registro-demandas-form.component';
import { ListadoDemandasComponent } from './listado-demandas/listado-demandas.component';

import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { PasswordValidationDirective } from './validations/password-validation.directive';
import { UsernameUnicoDirective } from './validations/username-unico.directive';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule } from 'ngx-toastr';

@NgModule({
  declarations: [
    RegistroDemandasFormComponent,
    ListadoDemandasComponent,
    PasswordValidationDirective,
    UsernameUnicoDirective,
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
     ToastrModule
  ]
})
export class DemandasModule { }
