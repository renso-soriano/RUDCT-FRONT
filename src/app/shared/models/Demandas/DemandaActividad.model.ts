import { Deserializable } from "../deserializable";

export class DemandaActividad implements Deserializable {

  id?: number;
  estatus?: string;
  demandaId?:	number;
  numero?: number;
  descripcion?: string;

  deserialize(input: any): this {
    Object.assign(this, input);
    return this;
  }
}
