import { Deserializable } from "../deserializable";

export class ContactoInstitucional implements Deserializable {


  deserialize(input: any): this {
    Object.assign(this, input);
    return this;
  }
}
