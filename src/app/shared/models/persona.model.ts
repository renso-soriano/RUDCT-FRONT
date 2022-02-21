import { Deserializable } from "./deserializable";

export class Persona implements Deserializable {
  nombre: string;
  apellido: string;
  institucionId:number;

  deserialize(input: any): this {
    Object.assign(this, input);
    return this;
  }
}
