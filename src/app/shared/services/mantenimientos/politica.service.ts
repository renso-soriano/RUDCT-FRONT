import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Ipolitica } from '../../models/ipolitica';

@Injectable({
  providedIn: 'root'
})
export class PoliticaService {

  constructor(private http: HttpClient) { }

  private URL = environment.apiUrl + "/demandas/politica/";
  private baseUrl = './assets/data/';


  getPoliticas(): Observable<Ipolitica[]> {
    return this.http.get<Ipolitica[]>(this.baseUrl + 'politicas.json');
  }

  getPoliticaById(PoliticaId: number): Observable<Ipolitica[]> {
    //return this.http.get<Iinstitucion>(this.URL + idInstitucion, {params: params});

    return this.http.get<Ipolitica[]>(this.baseUrl + 'politicas.json').pipe(
      map(politicas =>
        politicas.filter(politica => politica.PoliticaId == PoliticaId)
      )
    );
  }

  createPolitica(politica: Ipolitica):void
  {
    this.http.post(this.URL, politica);

  }

  updatePolitica(PoliticaId: number, politica: Ipolitica):void
  {
    this.http.put(this.URL + PoliticaId , politica);

  }

  deletePolitica(PoliticaId: number):void
  {
    this.http.delete(this.URL + PoliticaId);

  }
}
