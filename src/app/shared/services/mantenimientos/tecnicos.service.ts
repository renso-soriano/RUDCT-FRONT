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

  createTecnico(tecnico: Itecnico):void
  {
    this.http.post(this.URL, tecnico);

  }

  updateTecnico(Id: number, tecnico: Itecnico):void
  {
    this.http.put(this.URL + Id , tecnico);

  }

  deleteTecnico(Id: number):void
  {
    this.http.delete(this.URL + Id);

  }
}
