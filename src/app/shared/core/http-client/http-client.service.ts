import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { environment } from 'environments/environment'
import { Observable } from 'rxjs'
import { IHttpClient } from './Ihttp-client'

@Injectable({
  providedIn: 'root',
})
export class HttpClientService implements IHttpClient {
  private readonly url = environment.apiUrl
  // private readonly authUrl = environment.authUrl
  constructor(private _http: HttpClient) {}

  get<T>(route: string, options?: {}): Observable<T> {
    return this._http.get<T>(`${this.url}/${route}`, options)
  }

  getById<T>(route: string, id: number, options?: {}): Observable<T> {
    return this._http.get<T>(`${this.url}/${route}/${id}`, options)
  }

  post<T>(obj: object, route: string): Observable<T> {
    return this._http.post<T>(`${this.url}/${route}`, obj)
  }

  update<T>(id: number, obj: object, route: string): Observable<T> {
    return this._http.put<T>(`${this.url}/${route}/${id}`, obj)
  }

  patch<T>(obj: any, route: string): Observable<any> {
    return this._http.patch<T>(`${this.url}${route}`, obj)
  }

  delete<T>(id: number, route: string): Observable<any> {
    return this._http.delete<T>(`${this.url}/${route}/${id}`)
  }

  // getFile<T>(id: number, route: string): Observable<any> {
  //   return this._http.get<T>(`${this.authUrl}/${route}?ArchivoAnexoid=${id}`)
  // }

}
