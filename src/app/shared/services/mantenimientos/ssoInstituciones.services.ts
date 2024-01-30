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
  
      let params = new HttpParams();
      institutionIds.forEach(id => {
        params = params.append('ids', id.toString());
      });
  
      const headers = new HttpHeaders({
        'Accept': '*/*',
        'Content-Type': 'application/json-patch+json',
      });
  
      return this.http.get<number[]>(url, { params, headers });
    }

    getNombresInstituciones(institutionIds: number[]): Observable<string[]> {
      const url = `${this.URL}GetNombresInstituciones`;
    
      // Duplicate each ID in the array to create multiple instances of the 'ids' query parameter
      const queryParams = institutionIds.map(id => `ids=${id}`).join('&');
    
      // Construct the final URL with the query parameters
      const urlWithParams = `${url}?${queryParams}`;
    
      // Define headers with the appropriate content type
      const headers = new HttpHeaders({
        'Accept': '*/*',
        'Content-Type': 'application/json-patch+json',
      });
    
      return this.http.get<string[]>(urlWithParams, { headers });
    }
    
    
  }
    
  
