import { environment } from '../../../../environments/environment';
import { IDropDown } from '../../models/Idrop-down';
import { IDemanda } from '../../models/Idemanda';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Demanda } from 'app/shared/models/Demandas/Demanda.model';


@Injectable({
  providedIn: 'root'
})
export class DemandasService {

  private URL = environment.apiUrl + "Demanda";

  private baseURL = './assets/data/Demandas.json'

  constructor(private http: HttpClient) { }

  getDemandas(params?: HttpParams): Observable<Demanda[]> {
    return this.http.get<Demanda[]>(`${this.URL}/GetPaginate`, { params });
  }

  getDemandasForDashboard(params?: HttpParams): Observable<Demanda[]> {
    return this.http.get<Demanda[]>(`${this.URL}/GetDashboard`, { params });
  }

  getDemanda(idDemanda: string): Observable<IDemanda> {
    let params = new HttpParams().set('incluirDirecciones', "true");
    return this.http.get<IDemanda>(this.URL + '/' + idDemanda, {params: params});
  }

  getDemandaById(demandaId:string):Observable<Demanda> {
   // return this.http.get<IDemanda[]>(this.URL + CodigoDemanda)

    return this.http.get<Demanda>(`${this.URL}/${demandaId}`).pipe(
      map(demanda =>
        new Demanda().deserialize(demanda)
      )
    );
  }

  createDemanda(demanda: Demanda): Observable<Demanda> {
    return this.http.post<Demanda>(this.URL, demanda);
  }

  updateDemanda(demanda: Demanda): Observable<Demanda> {
    return this.http.put<Demanda>(`${this.URL}/${demanda.id}`, demanda);
  }

  deleteDemanda(idDemanda: string): Observable<Demanda> {
    return this.http.delete<Demanda>(this.URL + "/" + idDemanda);
  }


  consolidarDemandas(params?: HttpParams): Observable<Demanda[]> {

    return this.http.get<Demanda[]>(`${this.URL}/Consolidar`, { params });
  }

}
