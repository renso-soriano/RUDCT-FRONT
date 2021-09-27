import { Deserializable } from "../deserializable";

export class DropdownRequest implements Deserializable {

  nombreLista: string;
  padreId?: number;

  deserialize(input: any): this {
    Object.assign(this, input);
    return this;
  }
}
