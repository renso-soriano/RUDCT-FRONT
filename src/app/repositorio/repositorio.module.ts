import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { NgSelectModule } from "@ng-select/ng-select";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { ListadoDocumentosComponent } from './listado-documentos/listado-documentos.component';
import { ListadoVideosComponent } from './listado-videos/listado-videos.component';
import { RepositorioRoutingModule } from './repositorio-routing.module';
import { SharedModule } from 'app/shared/shared.module';
import { CrearDocumentosComponent } from './crear-documentos/crear-documentos.component';
import { NgxSpinnerModule } from "ngx-spinner";
import { ToastrModule } from 'ngx-toastr';



@NgModule({
  declarations: [
    CrearDocumentosComponent,
    ListadoDocumentosComponent,
    ListadoVideosComponent
  ],
  imports: [
    CommonModule,
    RepositorioRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgSelectModule,
    NgbModule,
    ToastrModule,
    NgxSpinnerModule,
    SharedModule,
    ]
})
export class RepositorioModule { }
