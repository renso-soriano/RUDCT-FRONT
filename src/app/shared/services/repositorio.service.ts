import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IRepositorioAnexo } from '../models/irepositorioanexo';


@Injectable({
  providedIn: 'root'
})
export class RepositorioAnexoService {

  constructor(private http: HttpClient) { }

  private URL = environment.apiUrl + "RepositorioAnexo";


  getDocumentosRepositorio(Page,Take): Observable<IRepositorioAnexo[]> {
    return this.http.get<IRepositorioAnexo[]>(`${this.URL}/GetPaginate?Page=${Page}&Take=${Take}`);
  }

  getDocumentosRepositorioById(Id: number): Observable<IRepositorioAnexo> {

    return this.http.get<IRepositorioAnexo>(`${this.URL}/${Id}`);

  }

  createDocumentosRepositorio(documento: IRepositorioAnexo): Observable<IRepositorioAnexo> {
    return this.http.post<IRepositorioAnexo>(this.URL, documento);
  }

  updateDocumentosRepositorio(documento: IRepositorioAnexo): Observable<IRepositorioAnexo> {
    return this.http.put<IRepositorioAnexo>(`${this.URL}${documento.id}`, documento);
  }

  deleteDocumentosRepositorio(documentoid: string): Observable<IRepositorioAnexo> {
    return this.http.delete<IRepositorioAnexo>(`${this.URL}/${documentoid}`);
  }

  subirDocumentos(ficheros: FormData): Observable<any> {
    return this.http.post<any>(`${this.URL}/subirDocumento`, ficheros);
}

  
}

