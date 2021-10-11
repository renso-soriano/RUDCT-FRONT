import { Deserializable } from "../deserializable";

export class DemandaContacto implements Deserializable {


      id?: number;
      estatus?: string;
      demandaId?: number;
      nombreCompleto?: string;
      telefono?: string;
      descripcion?: string;


  deserialize(input: any): this {
    Object.assign(this, input);
    return this;
  }
}
