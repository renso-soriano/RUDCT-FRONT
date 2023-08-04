import { Injectable, } from '@angular/core';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
// import { HttpClientService } from '@/shared/core/http-client/http-client.service';
import { map, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import Archivo from 'app/demandas/interface/archivo.interface';
import { DropDownServiceService } from '../drop-down-service.service';
import { environment } from 'environments/environment';
// import { FileDownload } from '@/shared/interface/randy-file/file-download.interface';
// import { IResponse } from '@/shared/interface/response.interface';
// import Archivo from '@/shared/interface/randy-file/archivo.interface';



@Injectable({
  providedIn: 'root'
})
export class RandyFileService {

  public route: string
  private API_URL_POST = environment.apiUrl + "File/UploadFileList"
  private API_URL_DOWNLOAD = environment.apiUrl + "File/Download"


  constructor(
    private _dropDowm: DropDownServiceService,
    private _http: HttpClient,
    private toastrService: ToastrService,

  ) { }



  getFileType() {
    return this._dropDowm.getFileType();
  }


  uploadFiles(archivos: FormData) {
    return this._http.post<number[]>(this.API_URL_POST, archivos)
  }

  downloadFile(fileId: number): Observable<any> {
    return this._http.get<any>(`${this.API_URL_DOWNLOAD}/${fileId}`, {})
      .pipe(
        map((res: any) => {
          console.log(res, "DOWNLOAD");

          let file = this.convertBase64ToBlob(res);
          let data = { file: file, nombreArchivo: res.fileDownloadName, base64: res.fileContents }
          return data;
        })
      );
  }

  createFormData(files: Archivo[]): FormData {
    const fileData = new FormData()

    files.map(archivo => {
      fileData.append("fileList", archivo.file)
      fileData.append("tiposDocumentoIds", archivo.tipoDocumentoId.toString())
    })

    return fileData;
  }


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


