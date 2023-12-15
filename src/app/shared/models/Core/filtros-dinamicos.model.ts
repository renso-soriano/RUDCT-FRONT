import { Observable } from "rxjs";
import { Deserializable } from "../deserializable";


export class FiltrosDinamicos implements Deserializable {
  tipo: string;
  label: string;
  servicio: Observable<any> | any[];
  name: string;
  placeholder: string;
  async: boolean;
  multiple: boolean;
  filtroHijo?: string;
  servicioHijo?: string;

  deserialize(input: any): this{
    Object.assign(this, input);
    return this;
  }
}
