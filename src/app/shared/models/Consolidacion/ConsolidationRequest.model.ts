import { DemandaComentario } from "../Demandas/DemandaComentario.model";
import { DemandaContacto } from "../Demandas/DemandaContacto.model";
import { Deserializable } from "../deserializable";


export class ConsolidationRequest implements Deserializable {

  ids?: number[];
  descripcion?: number;
  prioridad?:number;

  comentarioConsolidacion: string;
  demandaContactos: DemandaContacto[];

  deserialize(input: any): this {
    Object.assign(this, input);
    return this;
  }
}
