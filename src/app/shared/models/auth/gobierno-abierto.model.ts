export interface DashboardInciativasResponse {
  totalIniciativas: number;
  dashboardsCards: InciativasPorEstados[];
  cooperantesCards: InciativasPorCooperantes[];
  naturalezaCards: InciativasPorNaturaleza[];
  tematicaCards: InciativasPorTematica[];
  grupoPoblacionalCards: InciativasPorGrupoPoblacional[];
  ejeEndCards: InciativasPorEjeEnd[];
  politicaPNPSPCards: InciativasPorPoliticaPNPSP[];
  odsCards: InciativasPorOds[];
  ejecutoresFinancierasCards: InciativasPorEjecutoresFinancieras[];
  ejecutoresFisicosCards: InciativasPorEjecutoresFisicas[];
  iniciativasPorMunicipio:IniciativasPorMunicipio[],
  iniciativasPorProvincia:IniciativasPorProvincia[],
  iniciativasPorRegion:DemandasPorRegion[],
  data: any;
}

export interface InciativasPorEstados {
  estadoID: number | null;
  estadoNombre: string;
  cantidad: number | null;
  totalIniciativas: number | null;
  porcentaje: number;
}

export interface InciativasPorCooperantes {
  cooperanteId: number | null;
  cooperanteNombre: string;
  cantidad: number | null;
  totalIniciativas: number | null;
  porcentaje: number;
}

export interface InciativasPorNaturaleza {
  naturalezaId: number | null;
  naturalezaNombre: string;
  cantidad: number | null;
  totalIniciativas: number | null;
  porcentaje: number;
}

export interface InciativasPorTematica {
  tematicaId: number | null;
  tematicaNombre: string;
  cantidad: number | null;
  totalIniciativas: number | null;
  porcentaje: number;
}

export interface InciativasPorGrupoPoblacional {
  grupoPoblacionalId: number | null;
  grupoPoblacionalNombre: string;
  cantidad: number | null;
  totalIniciativas: number | null;
  porcentaje: number;
}

export interface InciativasPorEjeEnd {
  ejeEndId: number | null;
  ejeEndNombre: string;
  cantidad: number | null;
  totalIniciativas: number | null;
  porcentaje: number;
  abreviacion: string;
}

export interface InciativasPorPoliticaPNPSP {
  politicaId: number | null;
  politicaNombre: string;
  cantidad: number | null;
  totalIniciativas: number | null;
  porcentaje: number;
}

export interface InciativasPorOds {
  odsId: number | null;
  odsNombre: string;
  cantidad: number | null;
  totalIniciativas: number | null;
  porcentaje: number;
}

export interface InciativasPorEjecutoresFisicas {
  ejecutorId: number | null;
  ejecutorNombre: string;
  cantidad: number | null;
  totalIniciativas: number | null;
  porcentaje: number;
}

export interface InciativasPorEjecutoresFinancieras {
  ejecutorId: number | null;
  ejecutorNombre: string;
  cantidad: number | null;
  totalIniciativas: number | null;
  porcentaje: number;
}

export interface IniciativasPorMunicipio {
  muncipioId: number | null;
  nombre: string;
  enlace:string;
  cantidad: number | null;
  totalRegistros: number | null;
  porcentaje: number;
}

export interface IniciativasPorProvincia {
  provinciaId: number | null;
  nombre: string;
  enlace:string;
  cantidad: number | null;
  totalRegistros: number | null;
  porcentaje: number;
}

export interface DemandasPorRegion {
  regionId: number | null;
  nombre: string;
  enlace:string;
  cantidad: number | null;
  totalRegistros: number | null;
  porcentaje: number;
}
