import { ItemaComun } from '../../models/iTemaComun';
import { HttpClient } from '@angular/common/http';
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

  createTemaComun(temaComun: ItemaComun):void
  {
    this.http.post(this.URL, temaComun);

  }

  updateTemaComun(Id: number, temaComun: ItemaComun):void
  {
    this.http.put(this.URL + Id , temaComun);

  }

  deleteTemaComun(Id: number):void
  {
    this.http.delete(this.URL + Id);

  }
}
