import { IBeneficiario } from './iBeneficiario';
import { Iactividad } from "./iactividad";

export interface IDemanda {
  idDemanda?:number;
  codigo:string;
  año:number;
  regionId:number;
  provinciaKey:number;
  municipioKey:number;
  distritoMunicipalKey:number;
  fuenteOrigenId:number;
  descripcionDemanda:string;
  ejeId:number[];
  objetivoId:number[];
  beneficiarios:IBeneficiario[];
  institucionResponsableId:number;
  tecnicoOMPPId:number;
  estadoEjecucionId:number;
  politicasIds:number[];
  actividades:Iactividad[];
  institucionesColaboradorasIds:number[];
  tiposInversionIds:number[];
  otroTipoInversion:string;
  comentarios:string;
}
