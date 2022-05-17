import { Deserializable } from "../deserializable";

export class DropdownRequest implements Deserializable {

  nombreLista: string;
  padreId?: number;
  extraInfo:string;

  deserialize(input: any): this {
    Object.assign(this, input);
    return this;
  }
}
