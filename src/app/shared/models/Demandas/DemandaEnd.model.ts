import { Deserializable } from "../deserializable";

export class DemandaEnd implements Deserializable {

  id?: number;
  estatus?: string;
  demandaId?: number;
  ejeENDId?: number;
  nombreEjeEnd?: string;
  objetivoENDId?: number;
  nombreObjetivoEnd?: string;

  deserialize(input: any): this {
    Object.assign(this, input);
    return this;
  }
}
