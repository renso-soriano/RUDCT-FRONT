import { Deserializable } from "./deserializable";

export class Persona implements Deserializable {
  firstName: string;
  lastName: string;
  institutionId:number;

  deserialize(input: any): this {
    Object.assign(this, input);
    return this;
  }
}
