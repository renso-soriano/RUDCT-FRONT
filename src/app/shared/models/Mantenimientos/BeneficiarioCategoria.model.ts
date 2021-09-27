import { Deserializable } from "../deserializable";

export class BeneficiarioCategoria implements Deserializable {


  deserialize(input: any): this {
    Object.assign(this, input);
    return this;
  }
}
