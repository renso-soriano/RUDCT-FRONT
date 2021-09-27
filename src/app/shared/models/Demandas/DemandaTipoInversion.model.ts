import { Deserializable } from "../deserializable";

export class DemandaTipoInversion implements Deserializable {

  id?: number;
  estatus?: string;
  demandaId?: number;
  tipoInversionId?: number;
  nombreTipoInversion?: string;

  deserialize(input: any): this {
    Object.assign(this, input);
    return this;
  }
}
