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

    return this.http.get<IcategoriaBeneficiario>(this.URL + Id);

  }

  createCategoria(categoria: IcategoriaBeneficiario): Observable<IcategoriaBeneficiario> {
    return this.http.post<IcategoriaBeneficiario>(this.URL, categoria);
  }

  updateCategoria(categoria: IcategoriaBeneficiario): Observable<IcategoriaBeneficiario> {
    return this.http.put<IcategoriaBeneficiario>(`${this.URL}${categoria.id}`, categoria);
  }

  deleteCategoria(categoriaId: string): Observable<IcategoriaBeneficiario> {
    return this.http.delete<IcategoriaBeneficiario>(this.URL +  categoriaId);
  }
}
