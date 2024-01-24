import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { NgSelectModule } from "@ng-select/ng-select";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { ToastrModule } from "ngx-toastr";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { CrearContactoComponent } from './crear-contacto/crear-contacto.component';
import { DetalleContactoComponent } from './detalle-contacto/detalle-contacto.component';
import { ListadoContactoComponent } from './listado-contacto/listado-contacto.component';
import { NgxSpinnerModule } from "ngx-spinner";
import { ContactoInsticionalRouting } from "./contacto-institucion-routing.module";



@NgModule({
  declarations: [
    CrearContactoComponent,
    DetalleContactoComponent,
    ListadoContactoComponent
  ],
  imports: [
    CommonModule,
    ContactoInsticionalRouting,
    NgxDatatableModule,
    FormsModule,
    HttpClientModule,
    NgxSpinnerModule,
    ReactiveFormsModule,
    NgSelectModule,
    NgbModule,
    ToastrModule,
  ]
})
export class ContactoInstitucionModule { }
