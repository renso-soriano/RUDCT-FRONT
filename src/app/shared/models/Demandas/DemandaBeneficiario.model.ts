import { Deserializable } from "../deserializable";

export class DemandaBeneficiario implements Deserializable {

  id?: number;
  estatus?: string;
  demandaId?: number;
  beneficiarioCategoriaId?: number;
  nombreCategoria?: string;
  beneficiarioTipoId?: number;
  nombreTipo?: string;
  cantidad?: number;

  deserialize(input: any): this {
    Object.assign(this, input);
    return this;
  }
}
