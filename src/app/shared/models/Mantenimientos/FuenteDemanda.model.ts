import { Deserializable } from "../deserializable";

export class FuenteDemanda implements Deserializable {


  deserialize(input: any): this {
    Object.assign(this, input);
    return this;
  }
}
