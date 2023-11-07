import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { FiltrosDinamicos } from 'app/shared/models/Core/filtros-dinamicos.model';
import { AuthService } from 'app/shared/services/core/auth.service';
import { DropDownServiceService } from 'app/shared/services/drop-down-service.service';

@Component({
  selector: 'app-data-filter',
  templateUrl: './data-filter.component.html',
  styleUrls: ['./data-filter.component.scss']
})
export class DataFilterComponent implements OnInit {

  institucionUsuario: any;
  getInstitucionesUsuario: any;
  @Input() filtros: FiltrosDinamicos[];
  @Output() filterEvent = new EventEmitter<any>();
  selectedInstitucion: any;
  btnBuscarDisabled: boolean = false;

  formGroup: any;
  values: any = {};

  constructor(private dropdownsService: DropDownServiceService, private authService: AuthService, private formBuilder: FormBuilder) {

  }

  async getDropdowns() {
    //return await this.dropdownsService.getDropdowns().toPromise();
  }

  ngOnInit(): void {
    this.setFilterConfigs();
    this.filtros.forEach((filtro, i) => {
      this.formGroup.controls[filtro.name].valueChanges.subscribe(change => {
        if (filtro.filtroHijo !== undefined) {
          this.onParentFilterChange(filtro.filtroHijo, filtro.servicioHijo, change);
        }
      });
    });
  }

  onParentFilterChange(filtro: string, servicio: string, change: any): void {
    let indexFilter = this.filtros.findIndex((val, index) => {
      if(val.name === filtro) {
        return index;
      }
    });
    this.formGroup.controls[filtro].value = null;
    this.values[filtro] = null;
    this.filtros[indexFilter].servicio = this.dropdownsService[servicio](change);
  }

  get f() {
    return this.formGroup.controls;
  }

  setFilterConfigs(): void {
    let _controls: any = {};
    this.filtros.forEach((filtro: FiltrosDinamicos)=> {
      _controls[filtro.name] = [null];
      this.values[filtro.name] = null;
    });
    this.formGroup = this.formBuilder.group(_controls);
  }

  getFilters(): void {
    this.eventEmmiter();
  }

  clearFilters(): void {
    this.formGroup.reset();
    this.eventEmmiter();
  }

  eventEmmiter(): void {
    this.filterEvent.emit(this.formGroup.value);
  }

  serializeFilters(filter: any, def: any): any {
    if (filter === undefined || filter === null)
      return def;

    const tipo = filter instanceof Array;
    if (tipo) {
      let _filter = [];
      filter.forEach((e: any) => {
        _filter.push(e.id);
      });
      return _filter;
    } else {
      return filter.id;
    }
  }

}
