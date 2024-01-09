import { Injectable } from '@angular/core';
import * as _  from 'lodash';
import { Iemail } from '../models/Iemail';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: "root"
})
export class EmailService {

  constructor(private http: HttpClient) { }

  private URL = environment.apiUrl + "Mail";

  private baseURL = './assets/data'

  // 
  createEmail(datos: FormData | Iemail): Observable<Iemail> {
    if (datos instanceof FormData) {
        return this.http.post<Iemail>(`${this.URL}/send`, datos);
    }
 
        const formData = new FormData();
        formData.append('ToEmail', datos.ToEmail);
        formData.append('Subject', datos.Subject);
        formData.append('Body', datos.Body);
        
        return this.http.post<Iemail>(`${this.URL}/send`, formData);
    
}

}
