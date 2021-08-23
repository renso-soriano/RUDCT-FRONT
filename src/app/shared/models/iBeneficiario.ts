import { ItipoBeneficiario } from "./iTipoBeneficiario";

export interface IBeneficiario {
  Id: number,  
  tipoId:number,
  categoriaId:number,
  cantidad,
  Activo: number,
  DemandaId:number
}
