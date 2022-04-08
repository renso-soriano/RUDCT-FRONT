import { DemandaContacto } from "./DemandaContacto.model";
import { Deserializable } from "../deserializable";
import { DemandaActividad } from "./DemandaActividad.model";
import { DemandaBeneficiario } from "./DemandaBeneficiario.model";
import { DemandaComentario } from "./DemandaComentario.model";
import { DemandaEnd } from "./DemandaEnd.model";
import { DemandaInstitucion } from "./DemandaInstitucion.model";
import { DemandaPolitica } from "./DemandaPolitica.model";
import { DemandaTipoInversion } from "./DemandaTipoInversion.model";

export class Demanda implements Deserializable {
  id?: number;
  anio?: number;
  regionId?: number;
  nombreRegion?: string;
  provinciaId?: number;
  nombreProvincia?: string;
  municipioId?: number;
  nombreMunicipio?: string;
  distritoMunicipalId?: number;
  nombreDistritoMunicipal?: string;
  temaComunId?: number;
  finalidadTemaComun?: string;
  funcionTemaComun?: string;
  nombreTemaComun?: string;
  fuenteDemandaId?: number;
  nombreFuenteDemanda?: string;
  descripcion?: string;
  institucionId?: number;
  nombreInstitucionResponsable?: string;
  tecnicoOMPPId?: number;
  nombreTecnicoOmpp?: string;
  estadoId?: number;
  nombreEstadoDemanda?: string;
  demandaTipoId?: number;
  nombreTipoDemanda?: string;
  estatus?: string;
  tipoId?: number;
  prioridad?:number;
  coordenadaX?:string;
  coordenadaY?:string;
  consolidadaEn?:string;
  codigoSisplan?:string;
  codigoSnip?:string;
  codigoPoa?:string;
  codigoPei?:string;
  justificacionRechazo?:string;

  demandaActividades: DemandaActividad[];
  demandaBeneficiarios: DemandaBeneficiario[];
  demandaComentarios: DemandaComentario[];
  demandaResultadosEND: DemandaEnd[];
  demandaPoliticasPNPSP: DemandaPolitica[];
  institucionesInvolucradas: DemandaInstitucion[];
  demandaTipoInversiones: DemandaTipoInversion[];
  demandaContactos: DemandaContacto[];

  deserialize(input: any): this {
    Object.assign(this, input);
    return this;
  }
}
