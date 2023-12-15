
import { ToastrService } from 'ngx-toastr';
import { Injectable } from '@angular/core';

@Injectable()
export class NGXToastrService {
  constructor(public toastr: ToastrService) { }

  // Success Type
  typeSuccess(mensaje: string) {
    this.toastr.success(mensaje, 'Satisfactorio!');
  }
// Warning Type
  typeWarning(mensaje: string) {
    this.toastr.warning(mensaje, 'Advertencia!');
  }
// Error Type
  typeError(mensaje: string) {
    this.toastr.error(mensaje, 'Error!');
  }
// Info Type
  typeInfo(mensaje: string) {
    this.toastr.info(mensaje, 'Info!');
  }

  //Type Personalizado
  typeStatus(mensaje: string){
    this.toastr.info(mensaje, 'Estado de la demanda:');
  }
  typeInsti(mensaje: string){
    this.toastr.info(mensaje,'Institucion Responsable:');
  }
}
