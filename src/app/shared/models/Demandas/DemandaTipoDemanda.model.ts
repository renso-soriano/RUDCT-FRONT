import { Deserializable } from "../deserializable";

export class DemandaTipoDemanda implements Deserializable {

  id?: number;
  estatus?: string;
  demandaId?: number;
  tipoDemandaId?: number;
  nombre?: string;

  deserialize(input: any): this {
    Object.assign(this, input);
    return this;
  }
}
