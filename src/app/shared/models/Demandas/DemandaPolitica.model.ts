import { Deserializable } from "../deserializable";

export class DemandaPolitica implements Deserializable {

  id?: number;
  estatus?: string  ;
  demandaId?: number;
  politicaPNPSPId?: number;
  nombrePolitica?: string;

  deserialize(input: any): this {
    Object.assign(this, input);
    return this;
  }
}
