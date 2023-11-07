import { Deserializable } from "../deserializable";

export class DropdownResponse implements Deserializable {

  id: number;
  name: string;
  extraInfo?: string;

  deserialize(input: any): this {
    Object.assign(this, input);
    return this;
  }
}
