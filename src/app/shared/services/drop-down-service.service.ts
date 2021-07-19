import { environment } from './../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Iaño } from '../models/iaño';
import { IdistritoMunicipal } from '../models/idistrito-municipal';
import { IejeEnd } from '../models/ieje-end';
import { IestadoEjecucion } from '../models/iestado-ejecucion';
import { IfuenteDemanda } from '../models/ifuente-demanda';
import { Iinstitucion } from '../models/iinstitucion';
import { Imunicipio } from '../models/imunicipio';
import { IobjetivoEnd } from '../models/iobjetivo-end';
import { Ipolitica } from '../models/ipolitica';
import { Iprovincia } from '../models/iprovincia';
import { Iregion } from '../models/iregion';
import { Itecnico } from '../models/itecnico';


@Injectable({
  providedIn: 'root'
})
export class DropDownServiceService {

  constructor(private http: HttpClient) { }

  private URL = environment.apiUrl + "/demandas";

  private baseUrl = './assets/data/';

  // getAños
  getAños(): Observable<Iaño[]> {
    return this.http.get<Iaño[]>(this.baseUrl + 'Años.json');
  }

  getAño(idAño: string): Observable<Iaño> {
    return this.http.get<Iaño>(this.baseUrl + 'Años.json/'+ idAño);
    //return this.http.get<Iaño>(this.URL + '/años' + idAño, {params: params});
  }

  // getDistritos
  getDistritos(): Observable<IdistritoMunicipal[]> {
    return this.http.get<IdistritoMunicipal[]>(this.baseUrl + 'distritosMunicipales.json');
  }

  getDistrito(DistritoId: string): Observable<IdistritoMunicipal> {
    return this.http.get<IdistritoMunicipal>(this.baseUrl + 'distritosMunicipales.json/' + DistritoId );
  }

  // getEjes
  getEjes(): Observable<IejeEnd[]> {
    return this.http.get<IejeEnd[]>(this.baseUrl + 'ejesEnd.json');
  }

  getEje(EjeId: string): Observable<IejeEnd> {
       return this.http.get<IejeEnd>(this.baseUrl + 'ejesEnd.json/'+ EjeId);
  }

  // getEstados
  getEstados(): Observable<IestadoEjecucion[]> {
    return this.http.get<IestadoEjecucion[]>(this.baseUrl + 'estadoEjecucion.json');
  }

  getEstado(EstadoId: string): Observable<IestadoEjecucion> {
      return this.http.get<IestadoEjecucion>(this.baseUrl + 'estadoEjecucion.json/' + EstadoId);
  }

  // getFuentes
  getFuentes(): Observable<IfuenteDemanda[]> {
    return this.http.get<IfuenteDemanda[]>(this.baseUrl + 'fuenteDemandas.json');
  }

  getFuente(FuenteId: string): Observable<IfuenteDemanda> {
        return this.http.get<IfuenteDemanda>(this.baseUrl + 'fuenteDemandas.json/' + FuenteId);
  }

  // getInstituciones
  getInstituciones(): Observable<Iinstitucion[]> {
    return this.http.get<Iinstitucion[]>(this.baseUrl + 'Instituciones.json');
  }

  getInstitucion(IntitucionId: string): Observable<Iinstitucion> {
       return this.http.get<Iinstitucion>(this.baseUrl + 'Instituciones.json/' + IntitucionId);
  }

  // getMunicipios
  getMunicipios(): Observable<Imunicipio[]> {
    return this.http.get<Imunicipio[]>(this.baseUrl + 'municipios.json');
  }

  getMunicipio(MunicipioId: string): Observable<Imunicipio> {

    return this.http.get<Imunicipio>(this.baseUrl + 'municipios.json/' + MunicipioId );
  }

  // getObjetivos
  getObjetivos(): Observable<IobjetivoEnd[]> {
    return this.http.get<IobjetivoEnd[]>(this.baseUrl + 'objetivosEnd.json');
  }

  getObjetivo(ObjetivoId: string): Observable<IobjetivoEnd> {
       return this.http.get<IobjetivoEnd>(this.baseUrl + 'objetivosEnd.json/' + ObjetivoId);
  }

  // getPoliticas
  getPoliticas(): Observable<Ipolitica[]> {
    return this.http.get<Ipolitica[]>(this.baseUrl + 'politicas.json');
  }

  getPolitica(PoliticaId: string): Observable<Ipolitica> {
       return this.http.get<Ipolitica>(this.baseUrl + 'politicas.json/' + PoliticaId);
  }

  // getProvincias
  getProvincias(): Observable<Iprovincia[]> {
    return this.http.get<Iprovincia[]>(this.baseUrl + 'provincias.json');
  }

  getProvincia(ProvinciaId: string): Observable<Iprovincia> {

    return this.http.get<Iprovincia>(this.baseUrl + 'provincias.json/' + ProvinciaId);
  }

  // getRegiones
  getRegiones(): Observable<Iregion[]> {
    return this.http.get<Iregion[]>(this.baseUrl + 'regiones.json');
  }

  getRegion(RegionId: string): Observable<Iregion> {
        return this.http.get<Iregion>(this.baseUrl + 'regiones.json/' + RegionId);
  }

   // getTecnicos
   getTecnicos(): Observable<Itecnico[]> {
    return this.http.get<Itecnico[]>(this.baseUrl + 'tecnicoOMPP.json');
  }

  getTecnico(Id: string): Observable<Itecnico> {
        return this.http.get<Itecnico>(this.baseUrl + 'tecnicoOMPP.json/' + Id);
  }
}
