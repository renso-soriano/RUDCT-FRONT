import { Iactividad } from "./iactividad";

export interface IDemanda {
  idDemanda:number;
  codigo:string;
  año:number;
  regionId:number;
  provinciaId:number;
  municipioId:number;
  distritoMunicipalId:number;
  fuenteOrigenId:number;
  descripcionDemanda:string;
  ejeId:number;
  objetivoId:number;
  beneficiariosDirectosFamilias:number;
  beneficiariosDirectosPersonas:number;
  beneficiariosIndirectosFamilias:number;
  beneficiariosIndirectosPersonas:number;
  institucionResponsableId:number;
  tecnicoOMPPId:number;
  estadoEjecucionId:number;
  politicasIds:number[];
  actividades:Iactividad[];
  institucionesColaboradorasIds:number[];
  comentarios:string;
}
