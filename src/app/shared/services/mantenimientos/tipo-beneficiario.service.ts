import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ItipoBeneficiario } from '../../models/iTipoBeneficiario';

@Injectable({
  providedIn: 'root'
})
export class TipoBeneficiarioService {

  constructor(private http: HttpClient) { }

  private URL = environment.apiUrl + "BeneficiarioTipo/";
  private baseUrl = './assets/data/';


  getTiposBeneficiarios(): Observable<ItipoBeneficiario[]> {
    return this.http.get<ItipoBeneficiario[]>(this.URL);
  }

  getTipoBeneficiariosById(Id: number): Observable<ItipoBeneficiario> {
    return this.http.get<ItipoBeneficiario>(this.URL + Id);

  }

  createTipo(tipo: ItipoBeneficiario): Observable<ItipoBeneficiario> {
    return this.http.post<ItipoBeneficiario>(this.URL, tipo);
  }

  updateTipo(tipo: ItipoBeneficiario): Observable<ItipoBeneficiario> {
    return this.http.put<ItipoBeneficiario>(`${this.URL}${tipo.id}`, tipo);
  }

  deleteTipo(tipoId: string): Observable<ItipoBeneficiario> {
    return this.http.delete<ItipoBeneficiario>(this.URL +  tipoId);
  }
}
