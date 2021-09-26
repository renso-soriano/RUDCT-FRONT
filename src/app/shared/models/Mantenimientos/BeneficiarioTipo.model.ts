import { Deserializable } from "../deserializable";

export class BeneficiarioTipo implements Deserializable {


  deserialize(input: any): this {
    Object.assign(this, input);
    return this;
  }
}
