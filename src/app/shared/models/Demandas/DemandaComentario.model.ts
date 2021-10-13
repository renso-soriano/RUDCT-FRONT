import { Deserializable } from "../deserializable";

export class DemandaComentario implements Deserializable {

  id?: number;
  estatus?: string;
  demandaId?: number;
  comentrio?: string;

  deserialize(input: any): this {
    Object.assign(this, input);
    return this;
  }
}
