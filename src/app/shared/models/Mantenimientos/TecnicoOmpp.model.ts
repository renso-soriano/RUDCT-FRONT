import { Deserializable } from "../deserializable";

export class TecnicoOmpp implements Deserializable {


  deserialize(input: any): this {
    Object.assign(this, input);
    return this;
  }
}
