import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ItipoBeneficiario } from '../models/iTipoBeneficiario';

@Injectable({
  providedIn: 'root'
})
export class TipoBeneficiarioService {

  constructor(private http: HttpClient) { }

  private URL = environment.apiUrl + "/demandas/tipoBeneficiario/";
  private baseUrl = './assets/data/';


  getTiposBeneficiarios(): Observable<ItipoBeneficiario[]> {
    return this.http.get<ItipoBeneficiario[]>(this.baseUrl + 'tipoBeneficiario.json');
  }

  getTipoBeneficiariosById(Id: number): Observable<ItipoBeneficiario[]> {
    //return this.http.get<Iinstitucion>(this.URL + idInstitucion, {params: params});

    return this.http.get<ItipoBeneficiario[]>(this.baseUrl + 'tipoBeneficiario.json').pipe(
      map(tipos =>
        tipos.filter(tipo => tipo.Id == Id)
      )
    );
  }

  createTipo(tipo: ItipoBeneficiario):void
  {
    this.http.post(this.URL, tipo);

  }

  updateTipo(Id: number, tipo: ItipoBeneficiario):void
  {
    this.http.put(this.URL + Id , tipo);

  }

  deleteTipo(Id: number):void
  {
    this.http.delete(this.URL + Id);

  }
}
