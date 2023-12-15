import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IfuenteDemanda } from '../../models/ifuente-demanda';

@Injectable({
  providedIn: 'root'
})
export class FuenteService {

  constructor(private http: HttpClient) { }

  private URL = environment.apiUrl + "FuenteDemanda/";
  private baseUrl = './assets/data/';


  getFuentes(): Observable<IfuenteDemanda[]> {
    return this.http.get<IfuenteDemanda[]>(this.URL);
  }

  getFuenteById(FuenteId: number): Observable<IfuenteDemanda> {
    return this.http.get<IfuenteDemanda>(this.URL + FuenteId);
  }

  createFuente(fuente: IfuenteDemanda): Observable<IfuenteDemanda> {
    return this.http.post<IfuenteDemanda>(this.URL, fuente);
  }

  updateFuente(fuente: IfuenteDemanda): Observable<IfuenteDemanda> {
    return this.http.put<IfuenteDemanda>(`${this.URL}${fuente.id}`, fuente);
  }

  deleteFuente(fuenteId: string): Observable<IfuenteDemanda> {
    console.log(this.URL +  fuenteId);
    return this.http.delete<IfuenteDemanda>(this.URL +  fuenteId);
  }
}
