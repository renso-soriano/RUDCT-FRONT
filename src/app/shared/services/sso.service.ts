import { Injectable } from '@angular/core';
import * as _  from 'lodash';
import { Iemail } from '../models/Iemail';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: "root"
})
export class SSOService {

  constructor(private http: HttpClient) { }

  private URLSSO = 'http://apissov2.economia.local/'

  private baseURL = './assets/data'

  // 
  
  GetPersonByInstitutionId(institutionId: number[], applicationId: number): Observable<any> {
    const url = `${this.URLSSO}Api/Person/GetPersonByInstitutionId`;

    // Define headers with appropriate content type
    const headers = new HttpHeaders({
      'Accept': '*/*',
      'Content-Type': 'application/json-patch+json'
    });

    // Construct the payload as per the cURL command
    const body = {
      institutionId: institutionId,
      applicationId: applicationId
    };

    // Make the POST request
    return this.http.post<any>(url, body, { headers });
  }


  getPersonByGroupId(groupId:number,applicationId:number): Observable<any> {
    const url = `${this.URLSSO}Api/Person/GetPersonByGroupId?groupId=${groupId}&applicationId=${applicationId}`;

    return this.http.get<any>(url);
  }

}
