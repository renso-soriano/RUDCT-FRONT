import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IcategoriaBeneficiario } from '../../models/iCategoriaBeneficiario';


@Injectable({
  providedIn: 'root'
})
export class CategoriaBeneficiarioService {

  constructor(private http: HttpClient) { }

  private URL = environment.apiUrl + "BeneficiarioCategoria/";
  private baseUrl = './assets/data/';


  getCategoriasBeneficiarios(): Observable<IcategoriaBeneficiario[]> {
    return this.http.get<IcategoriaBeneficiario[]>(this.URL);
  }

  getCategoriaBeneficiariosById(Id: number): Observable<IcategoriaBeneficiario> {
    console.log(this.URL + Id);

    return this.http.get<IcategoriaBeneficiario>(this.URL + Id);

    /* return this.http.get<IcategoriaBeneficiario[]>(this.baseUrl + 'categoriaBeneficiario.json').pipe(
      map(tipos =>
        tipos.filter(tipo => tipo.Id == Id)
      )
    ); */
  }

  createCategoria(categoria: IcategoriaBeneficiario):void
  {
    this.http.post(this.URL, categoria);

  }

  updateCategoria(Id: number, categoria: IcategoriaBeneficiario):void
  {
    this.http.put(this.URL + Id , categoria);

  }

  deleteCategoria(Id: number):void
  {
    this.http.delete(this.URL + Id);

  }
}
