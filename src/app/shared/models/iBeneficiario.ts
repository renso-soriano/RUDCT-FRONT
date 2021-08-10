import { ItipoBeneficiario } from "./iTipoBeneficiario";

export interface IBeneficiario {
  Id: number,
  Directos: number,
  Indirectos: number,
  tipoId:number,
  Activo: number,
  DemandaId:number
}
