import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IcategoriaBeneficiario } from '../models/iCategoriaBeneficiario';


@Injectable({
  providedIn: 'root'
})
export class CategoriaBeneficiarioService {

  constructor(private http: HttpClient) { }

  private URL = environment.apiUrl + "/demandas/categoriaBeneficiario/";
  private baseUrl = './assets/data/';


  getCategoriasBeneficiarios(): Observable<IcategoriaBeneficiario[]> {
    return this.http.get<IcategoriaBeneficiario[]>(this.baseUrl + 'categoriaBeneficiario.json');
  }

  getCategoriaBeneficiariosById(Id: number): Observable<IcategoriaBeneficiario[]> {
    //return this.http.get<Iinstitucion>(this.URL + idInstitucion, {params: params});

    return this.http.get<IcategoriaBeneficiario[]>(this.baseUrl + 'categoriaBeneficiario.json').pipe(
      map(tipos =>
        tipos.filter(tipo => tipo.Id == Id)
      )
    );
  }

  createTipo(tipo: IcategoriaBeneficiario):void
  {
    this.http.post(this.URL, tipo);

  }

  updateTipo(Id: number, tipo: IcategoriaBeneficiario):void
  {
    this.http.put(this.URL + Id , tipo);

  }

  deleteTipo(Id: number):void
  {
    this.http.delete(this.URL + Id);

  }
}
