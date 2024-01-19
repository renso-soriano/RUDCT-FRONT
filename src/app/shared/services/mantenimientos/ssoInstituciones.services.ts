import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SSOInstitucionService {
  private URL = environment.apiUrl + 'InstitucionesEstatales/';

  constructor(private http: HttpClient) {}


  
    getSSOInstitucionIds(institutionIds: number[]): Observable<number[]> {
      const url = `${this.URL}SsoInstitucionIds`;
  
      // Crea un objeto HttpParams para manejar los parámetros de la URL
      let params = new HttpParams();
      institutionIds.forEach(id => {
        params = params.append('ids', id.toString());
      });
  
      // Define headers con el tipo de contenido apropiado
      const headers = new HttpHeaders({
        'Accept': '*/*',
        'Content-Type': 'application/json-patch+json',
      });
  
      // Realiza la solicitud GET con los parámetros en el objeto HttpParams
      return this.http.get<number[]>(url, { params, headers });
    }
  }
  

  // Otros métodos según tus necesidades...
