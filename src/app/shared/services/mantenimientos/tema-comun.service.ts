import { ItemaComun } from '../../models/iTemaComun';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class TemaComunService {

  constructor(private http: HttpClient) { }

  private URL = environment.apiUrl + "TemaComun/";
  private baseUrl = './assets/data/';


  getTemasComunes(): Observable<ItemaComun[]> {
    return this.http.get<ItemaComun[]>(this.URL);
  }

  getTemaComunById(Id: number): Observable<ItemaComun> {
    return this.http.get<ItemaComun>(this.URL + Id);

  }

  getTemaComunByParam(params: HttpParams): Observable<any> {
    return this.http.get<any>(this.URL +`GetByParam/`, {params:params});

  }

  createTemaComun(tema: ItemaComun): Observable<ItemaComun> {
    return this.http.post<ItemaComun>(this.URL, tema);
  }

  updateTemaComun(tema: ItemaComun): Observable<ItemaComun> {
    return this.http.put<ItemaComun>(`${this.URL}${tema.id}`, tema);
  }

  deleteTemaComun(temaId: string): Observable<ItemaComun> {
    return this.http.delete<ItemaComun>(this.URL +  temaId);
  }
}
