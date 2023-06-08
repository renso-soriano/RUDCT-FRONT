import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './login/login.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { createTranslateLoader } from 'app/app.module';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { QuienSoyComponent } from './quien-soy/quien-soy.component';
import { GobiernoAbiertoComponent } from './gobierno-abierto/gobierno-abierto.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgSelectModule } from '@ng-select/ng-select';
import { ToastrModule } from 'ngx-toastr';
import { SharedModule } from 'app/shared/shared.module';
import { ChartistModule } from 'ng-chartist';
import { MatchHeightModule } from 'app/shared/directives/match-height.directive';
import { NgApexchartsModule } from 'ng-apexcharts';
import { AngularResizedEventModule } from 'angular-resize-event';
import { RegionChartComponent } from 'app/shared/components/region-chart/region-chart.component';


@NgModule({
  declarations: [
    LoginComponent,
    ResetPasswordComponent,
    QuienSoyComponent,
    GobiernoAbiertoComponent,

  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    NgxDatatableModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgSelectModule,
    NgbModule,
    ToastrModule,
    NgxSpinnerModule,
    SharedModule,
    NgbModule,
    CommonModule,
    ChartistModule,
    NgbModule,
    MatchHeightModule,
    NgApexchartsModule,
    AngularResizedEventModule,
    SharedModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      }
    }),
    NgxSpinnerModule,
  ]
})
export class AuthModule { }
