import { Deserializable } from "../deserializable";

export class RepositorioVideo implements Deserializable {


  deserialize(input: any): this {
    Object.assign(this, input);
    return this;
  }
}
