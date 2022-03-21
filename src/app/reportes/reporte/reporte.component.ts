import { ExcelService } from './../../shared/services/excel.service';
import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import { DatatableData } from './data/datatables.data';
import {
  ColumnMode,
  DatatableComponent,
  SelectionType
} from '@swimlane/ngx-datatable';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { DemandasService } from 'app/shared/services/mantenimientos/demandas.service';
import { Router } from '@angular/router';
import * as alertFunctions from '../../shared/data/sweet-alerts';
import { Observable, from } from 'rxjs';
import { Demanda } from 'app/shared/models/Demandas/Demanda.model';
import { FiltrosDinamicos } from 'app/shared/models/Core/filtros-dinamicos.model';
import { DropDownServiceService } from 'app/shared/services/drop-down-service.service';
import { environment } from 'environments/environment';
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { FormBuilder, Validators } from '@angular/forms';
import { NgxSpinnerService } from "ngx-spinner";
import { NGXToastrService } from "app/shared/services/ngxtoastr.service";
import { AuthService } from 'app/shared/services/core/auth.service';
import { saveAs } from 'file-saver';

declare var require: any;
const data: any = require('../../shared/data/Demandas.json');

@Component({
  selector: 'app-reporte',
  templateUrl: './reporte.component.html',
  styleUrls: ['./reporte.component.scss', '../../../assets/sass/libs/datatables.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [NGXToastrService]
})
export class ReporteComponent implements OnInit {

  loadingIndicator: boolean = true;
  reorderable: boolean = true;

  //data:any[];
  notFound = false;

  demanda: Demanda;
  listadoInstituciones: Observable<any[]>;
  listadoFuentes: Observable<any[]>;
  listadoTipos: Observable<any[]>;
  listadoProvincias: Observable<any[]>;
  listadoMunicipios: Observable<any[]>;
  listadoTemaComun: Observable<any[]>;
  listadoEstados: Observable<any[]>;

  institucionUsuario: number;
  grupoUsuario: number[] = [0];
  usuarioPermisos: any = [''];
  pdf: any;
  tipoReporteSelected: number;


  reportForm = this.formBuilder.group({

    reporteTipo: [20],
    provinciaId: [null],
    estadoId: [7],
    todasId: [20]
  });

  get RF() {
    return this.reportForm.controls;
  }

  constructor(private http: HttpClient,
    private modalService: NgbModal,
    private demandasService: DemandasService,
    private formBuilder: FormBuilder,
    private serviceStr: NGXToastrService,
    private spinner: NgxSpinnerService,
    private authService: AuthService,
    private router: Router, private dropdownService: DropDownServiceService, private excelService: ExcelService) {

    setTimeout(() => { this.loadingIndicator = false; }, 1500);
  }


  ngOnInit() {
    //var usuarioInstitucion = this.authService.getInstitucion();
    const modulo = this.authService.findModule(this.router.routerState.snapshot.url);

    const observable = from(this.authService.getPermissions(modulo.id));

    observable.subscribe((res: any) => {
      this.usuarioPermisos = res.acciones;
      this.institucionUsuario = 1;
      this.grupoUsuario = this.usuarioPermisos.includes("MANAGE") ? [1] : [17];
    }, (err: any) => {
      console.error(err);
    });

    this.llenarListados();

  }

  tipoReporte: any = [

    { value: 1, label: "Provincias" },
    { value: 2, label: "Estado" },
    { value: 8, label: "Imprimir todas" }
  ];



  exportReport() {

    let params;

    switch (this.RF.reporteTipo.value) {

      case 1: {
        params = new HttpParams()
          .set('tipoId', this.RF.reporteTipo.value)
          .set('id', this.RF.provinciaId.value)
          .set('usuario', this.authService.getUserCompleteName());
        break;
      }
      case 2: {
        params = new HttpParams()
          .set('tipoId', this.RF.reporteTipo.value)
          .set('id', this.RF.estadoId.value)
          .set('usuario', this.authService.getUserCompleteName());
        break;
      }
      default: {
        params = new HttpParams()
          .set('tipoId', this.RF.reporteTipo.value)
          .set('id', this.RF.todasId.value)
          .set('usuario', this.authService.getUserCompleteName());
        break;
      }
    }

    this.demandasService.getDemandasReporte(params).subscribe((data: any) => {

      this.pdf = data;
      this.salvarImprimirReporte();

    },
      (err: any) => {
        console.error(err);
        this.notFound = true;
        document.body.click();
      },
      () => {
        document.body.click();
      });

  }

  salvarImprimirReporte() {
    //let date = Date.prototype.getDate();

    saveAs(this.pdf, "Demandas.xls");
    //const fileURL = URL.createObjectURL(this.pdf);
    //window.open(fileURL, '_blank');

  }

  changeTipoReporte(event: any) {

    this.RF.reporteTipo.setValue(event.value);

    this.reportForm.patchValue({

      tipoId: null,
      provinciaId: null,

    });

  }
  onInstitucionChange() { }
  onFuenteChange() { }
  onTipoChange() { }
  onProvinciaChange() { }
  onMunicipiosChange() { }
  onTemaComunChange() { }


  llenarListados() {
    this.listadoInstituciones = this.dropdownService.getInstituciones();
    this.listadoFuentes = this.dropdownService.getFuentes();
    this.listadoTipos = this.dropdownService.getTiposDemandas();
    this.listadoProvincias = this.dropdownService.getProvincias();
    this.listadoMunicipios = this.dropdownService.getMunicipios();
    this.listadoTemaComun = this.dropdownService.getTemasComunes();
    this.listadoEstados = this.dropdownService.getEstados();

  }



}
