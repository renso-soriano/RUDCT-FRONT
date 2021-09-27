import { Deserializable } from "../deserializable";

export class DemandaInstitucion implements Deserializable {

  id?: number;
  estatus?: string  ;
  demandaId?: number;
  institucionId?: number;
  nombreInstitucion?: string;

  deserialize(input: any): this {
    Object.assign(this, input);
    return this;
  }
}
