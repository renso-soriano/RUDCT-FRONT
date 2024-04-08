import { Deserializable } from "../deserializable";

export class RepositorioAnexo implements Deserializable {


  deserialize(input: any): this {
    Object.assign(this, input);
    return this;
  }
}
