import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import Archivo from '../interface/archivo.interface';
import { env } from 'process';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FileManagerService {

  public route: string
  private API_URL_POST = environment.apiUrl+"File/UploadFileList"
  private API_URL_DOWNLOAD = "File/Download"



constructor(private _http: HttpClient,
  private toastrService: ToastrService,) { }

  uploadFiles(archivos:FormData) {
    archivos.forEach(value=>{
      console.log(value, "IN FILE UPLOAD");
    })
    console.log("servicio al work", archivos);
    return this._http.post(this.API_URL_POST,archivos)

  }


  downloadFile(fileId: number): Observable<any> {
    return this._http.get<any>(`${this.API_URL_DOWNLOAD}/${fileId}`)
      .pipe(
        map((res: any) => {
          console.log(res, "DOWNLOAD");

          let file = this.convertBase64ToBlob(res);
          let data = { file: file, nombreArchivo: res.fileDownloadName }
          return data;
        })
      );
  }


  createFormData(files: Archivo[]): FormData {
    const fileData = new FormData()

    files.map(archivo => {
      console.log(archivo,"ARCHIVO");
      fileData.append("fileList", archivo.file)
      fileData.append("tiposDocumentoIds", archivo.tipoDocumentoId.toString())
    })
    console.log("FORMA DATA CREATE", fileData);
    return fileData;
  }


  // PARA DESCARGAR ARCHIVOS
  convertBase64ToBlob(data): any {
    const byteCharacters = atob(data.fileContents);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const file = new Blob([byteArray], { type: data.contentType });
    return file;
  }



}
