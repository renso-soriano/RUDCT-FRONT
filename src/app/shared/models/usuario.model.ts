import { Deserializable } from "./deserializable";

export class Usuario implements Deserializable {
  id: number;
  nombreUsuario: string;

  deserialize(input: any): this {
    Object.assign(this, input);
    return this;
  }
}
