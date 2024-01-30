import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IcontactoInstitucional } from '../../models/iContactoInstitucional.model';
import { ContactoInstitucional } from 'app/shared/models/Mantenimientos/ContactoInstitucional.model';


@Injectable({
  providedIn: 'root'
})
export class ContactoInsticionalService {

  constructor(private http: HttpClient) { }

  private URL = environment.apiUrl + "ContactoInstitucional/";


  getContactosInstitucion(): Observable<IcontactoInstitucional[]> {
    return this.http.get<IcontactoInstitucional[]>(this.URL);
  }

  getContactosInstitucionById(Id: number): Observable<IcontactoInstitucional> {

    return this.http.get<IcontactoInstitucional>(this.URL + Id);

  }

  createContactosInstitucion(contacto: IcontactoInstitucional): Observable<IcontactoInstitucional> {
    return this.http.post<IcontactoInstitucional>(this.URL, contacto);
  }

  updateContactosInstitucion(contacto: IcontactoInstitucional): Observable<IcontactoInstitucional> {
    return this.http.put<IcontactoInstitucional>(`${this.URL}${contacto.id}`, contacto);
  }

  deleteContactosInstitucion(contactoid: string): Observable<IcontactoInstitucional> {
    return this.http.delete<IcontactoInstitucional>(this.URL +  contactoid);
  }

  getExportarContactosInstitucionales(params?: HttpParams): Observable<ContactoInstitucional[]> {
    return this.http.get<ContactoInstitucional[]>(`${this.URL}GetExportarContactosInstitucionales`, { params });
  }

}

