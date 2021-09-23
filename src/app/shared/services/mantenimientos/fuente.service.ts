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

  createFuente(fuente: IfuenteDemanda):void
  {
    this.http.post(this.URL, fuente);

  }

  updateFuente(FuenteId: number, fuente: IfuenteDemanda):void
  {
    this.http.put(this.URL + FuenteId , fuente);

  }

  deleteFuente(FuenteId: number):void
  {
    this.http.delete(this.URL + FuenteId);

  }
}
