import { Deserializable } from "./deserializable";

export class Grupo implements Deserializable {

  groupId:number;
  groupName:string;
  id:number;
  userId:number;


  deserialize(input: any): this {
    Object.assign(this, input);
    return this;
  }
}
