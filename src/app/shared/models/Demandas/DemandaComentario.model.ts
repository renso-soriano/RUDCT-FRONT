import { Deserializable } from "../deserializable";

export class DemandaComentario implements Deserializable {

  id?: number;
  estatus?: string;
  demandaId?: number;
  comentario?: string;
  userName?: string;
  fechaRegistro?: Date;
  institucionId?:number;

  deserialize(input: any): this {
    Object.assign(this, input);
    return this;
  }
}
