import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IcontanctoInstitucional } from '../../models/iContactoInstitucional.model';


@Injectable({
  providedIn: 'root'
})
export class ContactoInsticionalService {

  constructor(private http: HttpClient) { }

  private URL = environment.apiUrl + "ContactoInstitucional/";
  private baseUrl = './assets/data/';


  getContactosInstitucion(): Observable<IcontanctoInstitucional[]> {
    return this.http.get<IcontanctoInstitucional[]>(this.URL);
  }

  getContactosInstitucionById(Id: number): Observable<IcontanctoInstitucional> {

    return this.http.get<IcontanctoInstitucional>(this.URL + Id);

  }

  createContactosInstitucion(contacto: IcontanctoInstitucional): Observable<IcontanctoInstitucional> {
    return this.http.post<IcontanctoInstitucional>(this.URL, contacto);
  }

  updateContactosInstitucion(contacto: IcontanctoInstitucional): Observable<IcontanctoInstitucional> {
    return this.http.put<IcontanctoInstitucional>(`${this.URL}${contacto.id}`, contacto);
  }

  deleteContactosInstitucion(contactoid: string): Observable<IcontanctoInstitucional> {
    return this.http.delete<IcontanctoInstitucional>(this.URL +  contactoid);
  }
}
