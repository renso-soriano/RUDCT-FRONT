import { Itecnico } from './../../models/itecnico';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IcategoriaBeneficiario } from '../../models/iCategoriaBeneficiario';


@Injectable({
  providedIn: 'root'
})
export class TecnicosService {

  constructor(private http: HttpClient) { }

  private URL = environment.apiUrl + "TecnicoOMPP/";
  private baseUrl = './assets/data/';


  getTecnicos(): Observable<Itecnico[]> {
    return this.http.get<Itecnico[]>(this.URL);
  }

  getTecnicosById(Id: number): Observable<Itecnico> {

    return this.http.get<Itecnico>(this.URL + Id);

  }

  createTecnico(tecnico: Itecnico): Observable<Itecnico> {

    return this.http.post<Itecnico>(this.URL, tecnico);
  }

  updateTecnico(tecnico: Itecnico): Observable<Itecnico> {
    return this.http.put<Itecnico>(`${this.URL}${tecnico.id}`, tecnico);
  }

  deleteTecnico(tecnicoId: string): Observable<Itecnico> {
    return this.http.delete<Itecnico>(this.URL +  tecnicoId);
  }
}
