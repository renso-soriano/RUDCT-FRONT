import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Iinstitucion } from '../models/iinstitucion';

@Injectable({
  providedIn: 'root'
})
export class InstitucionService {

  constructor(private http: HttpClient) { }

  private URL = environment.apiUrl + "/demandas/institucion/";
  private baseUrl = './assets/data/';


  getInstituciones(): Observable<Iinstitucion[]> {
    return this.http.get<Iinstitucion[]>(this.baseUrl + 'Instituciones.json');
  }

  getInstitucionById(idInstitucion: number): Observable<Iinstitucion[]> {
    //return this.http.get<Iinstitucion>(this.URL + idInstitucion, {params: params});

    return this.http.get<Iinstitucion[]>(this.baseUrl + 'Instituciones.json').pipe(
      map(instituciones =>
        instituciones.filter(institucion => institucion.InstitucionId == idInstitucion)
      )
    );
  }

  createInstitucion(institucion: Iinstitucion):void
  {
    this.http.post(this.URL, institucion);

  }

  updateInstitucion(idInstitucion: number, institucion: Iinstitucion):void
  {
    this.http.put(this.URL + idInstitucion , institucion);

  }

  deleteInstitucion(idInstitucion: number):void
  {
    this.http.delete(this.URL + idInstitucion);

  }
}
