import { environment } from './../../../environments/environment';
import { IDropDown } from './../models/Idrop-down';
import { IDemanda } from './../models/Idemanda';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DemandasService {

  private URL = environment.apiUrl + "/demandas";

  private baseURL = './assets/data/Demandas.json'

  constructor(private http: HttpClient) { }

  getDemandas(): Observable<any[]> {
    return this.http.get<any[]>(this.baseURL);
  }

  getDemanda(idDemanda: string): Observable<IDemanda> {
    let params = new HttpParams().set('incluirDirecciones', "true");
    return this.http.get<IDemanda>(this.URL + '/' + idDemanda, {params: params});
  }

  getDemandaByCodigo(CodigoDemanda:string):Observable<any[]> {
   // return this.http.get<IDemanda[]>(this.URL + CodigoDemanda)

    return this.http.get<any[]>(this.baseURL).pipe(
      map(demandas =>
        demandas.filter(demanda => demanda.CodigoDemanda == CodigoDemanda)
      )
    );
  }

  createDemanda(demanda: IDemanda): Observable<IDemanda> {
    return this.http.post<IDemanda>(this.URL, demanda);
  }

  updateDemanda(demanda: IDemanda): Observable<IDemanda> {
    return this.http.put<IDemanda>(this.URL + "/" + demanda.idDemanda.toString(), demanda);
  }

  deletePersona(idDemanda: string): Observable<IDemanda> {
    return this.http.delete<IDemanda>(this.URL + "/" + idDemanda);
  }


}
