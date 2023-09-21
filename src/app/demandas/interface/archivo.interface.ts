import { TipoDocumento } from "../enum/tipo-documento.enum"

export default interface Archivo {
  id?: number
  entityId?: number,
  file: any,
  tipoDocumentoId: TipoDocumento
  estadoAnexo?: boolean
  institucionNombre?: string
  fileId?: number
}
