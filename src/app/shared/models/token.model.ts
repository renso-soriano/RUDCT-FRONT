import { RouteInfo } from "../vertical-menu/vertical-menu.metadata";
import { Deserializable } from "./deserializable";
import { Grupo } from "./grupo.model";
import { Persona } from "./persona.model";
import { Usuario } from "./usuario.model";

export class Token implements Deserializable {

  accessToken: string;
  usuario: Usuario;
  persona: Persona;
  menu: RouteInfo[];
  grupos:Grupo[];

  deserialize(input: any): this {
    Object.assign(this, input);
    return this;
  }

}
