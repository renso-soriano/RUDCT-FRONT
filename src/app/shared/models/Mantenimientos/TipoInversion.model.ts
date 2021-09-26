import { Deserializable } from "../deserializable";

export class TipoInversion implements Deserializable {

  deserialize(input: any): this {
    Object.assign(this, input);
    return this;
  }
}
