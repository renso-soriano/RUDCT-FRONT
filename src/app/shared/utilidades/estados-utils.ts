import { Injectable } from '@angular/core';
import { Estados } from '../models/auth/estados.enum';

@Injectable({
  providedIn: 'root'
})
export class EstadoUtilsService {

  getEstadoClass(estadoId: number): { [className: string]: boolean } {
    return {
        'bg-danger': estadoId === 3,
        'bg-warning': estadoId === 2,
        'bg-info': estadoId === 5,
        'bg-primary': estadoId === 4,
        'bg-secondary': estadoId === 1,
        'bg-success': estadoId === 6,
        'bg-dark': estadoId === 7
      };
  }

  getEstadoIdForInstitucion(institucionesInvolucradas: any[], idInstitucion: number): number | null {
    const institucionInvolucrada = institucionesInvolucradas.find(institucion => institucion.institucionId === idInstitucion);
    return institucionInvolucrada ? institucionInvolucrada.estadoId : null;
  }

  titleEstadoEjecucion(id:number):string{

    switch (id) {
      case Estados.pendienteAsignarSectorial:
        return 'Pendiente Asignar Sectorial';
      case Estados.asignadoASectorial:
        return 'Asignado A Sectorial';
      case Estados.reasignacionSectorial:
        return 'Reasignacion Sectorial';
      case Estados.enProcesoDeEjecucion:
        return 'En Proceso De Ejecucion';
      case Estados.incluidoEnPEI:
        return 'Incluido En PEI';
      case Estados.programadoEnPOA:
        return 'Programado En POA';
      case Estados.noInciada:
        return 'No Iniciada';
      case Estados.ejecutado:
        return 'Ejecutado';
      default:
        return '';
    }

  }

}