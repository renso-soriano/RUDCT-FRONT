export class DashboardResponse {
  totalDemandas: number;
  demandasPorEje: DemandasByEjeEND[];
  demandasPorEstado: DemandasByEstado[];
  demandasPorRegion: DemandasByRegion[];
  demandasPorProvincia: DemandasByProvincia[];
  demandasPorMunicipio: DemandasByMunicipio[];
  demandaCoordenadasProvincias: any;
  demandaCoordenadasMunicipios: any;
  data: any;
}

export class DemandasByEjeEND {
  ejeId: number | null;
  cantidad: number;
}
export class DemandasByEstado {
  estadoId: number | null;
  nombre:string | null
  cantidad: number;
}

export class DemandasByRegion {
  regionId: number | null;
  nombreRegion: string;
  porcentaje: number;
}

export class DemandasByProvincia {
  provinciaId: number | null;
  nombre: string;
  cantidad: number;
}

export class DemandasByMunicipio {
  municipioId: number | null;
  nombre: string;
  cantidad: number;
}

