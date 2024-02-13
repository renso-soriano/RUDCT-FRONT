import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IRepositorioVideo } from 'app/shared/models/irepositoriovideo';


@Injectable({
  providedIn: 'root'
})
export class RepositorioVideoService {

  constructor(private http: HttpClient) { }

  private URL = environment.apiUrl + "RepositorioVideo";


  getRepositorioVideo(): Observable<IRepositorioVideo[]> {
    return this.http.get<IRepositorioVideo[]>(this.URL);
  }

  getRepositorioVideoById(Id: number): Observable<IRepositorioVideo> {

    return this.http.get<IRepositorioVideo>(`${this.URL}/${Id}`);

  }

  createRepositorioVideo(documento: IRepositorioVideo): Observable<IRepositorioVideo> {
    return this.http.post<IRepositorioVideo>(this.URL, documento);
  }

  updateRepositorioVideo(documento: IRepositorioVideo): Observable<IRepositorioVideo> {
    return this.http.put<IRepositorioVideo>(`${this.URL}${documento.id}`, documento);
  }

  deleteRepositorioVideo(Id: string): Observable<IRepositorioVideo> {
    return this.http.delete<IRepositorioVideo>(`${this.URL}/${Id}`);
  }
  
}

