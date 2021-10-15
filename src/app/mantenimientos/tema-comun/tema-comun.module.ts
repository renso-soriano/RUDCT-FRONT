import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { TemaComunRoutingModule } from "./tema-comun-routing.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { NgSelectModule } from "@ng-select/ng-select";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { ToastrModule } from "ngx-toastr";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { ListadoTemaComunComponent } from "./listado-tema-comun/listado-tema-comun.component";
import { CrearTemaComunComponent } from "./crear-tema-comun/crear-tema-comun.component";
import { DetalleTemaComunComponent } from "./detalle-tema-comun/detalle-tema-comun.component";
import { NgxSpinnerModule } from "ngx-spinner";

@NgModule({
  declarations: [
    ListadoTemaComunComponent,
    CrearTemaComunComponent,
    DetalleTemaComunComponent,
  ],
  imports: [
    CommonModule,
    TemaComunRoutingModule,
    NgxDatatableModule,
    FormsModule,
    HttpClientModule,
    NgxSpinnerModule,
    ReactiveFormsModule,
    NgSelectModule,
    NgbModule,
    ToastrModule,
  ],
})
export class TemaComunModule {}
