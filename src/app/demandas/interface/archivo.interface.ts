import { TipoDocumento } from "../enum/tipo-documento.enum"

export default interface Archivo {
  fileId?: number
  Data?: FormData,
  FileTypeId: TipoDocumento
}
