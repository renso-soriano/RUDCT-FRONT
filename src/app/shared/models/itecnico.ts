export interface Itecnico {
  id: number,
  estatus: string,
  municipioId: number,
  tipoTecnicoId:number,
  nombre: string,
  apellido: string,
  telefono: string,
  extension: string,
  flota?: string,
  email?:string,
  tipoTecnicoNombre?:string

}


