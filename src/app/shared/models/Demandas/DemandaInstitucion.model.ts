import { Deserializable } from "../deserializable";

export class DemandaInstitucion implements Deserializable {

  id?: number;
  estatus?: string  ;
  demandaId?: number;
  
  estadoId?: number;
  nombreEstado?: string;

  institucionId?: number;
  nombreInstitucion?: string;

  codigoSnip?: string;
  codigoPoa?: string;
  codigoPei?: string;


  deserialize(input: any): this {
    Object.assign(this, input);
    return this;
  }
}
