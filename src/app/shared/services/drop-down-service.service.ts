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
import { map } from 'rxjs/operators';
import { ItipoInversion } from '../models/iTipoInversion';
import { ItipoBeneficiario } from '../models/iTipoBeneficiario';
import { IcategoriaBeneficiario } from '../models/iCategoriaBeneficiario';

@Injectable({
  providedIn: 'root'
})
export class DropDownServiceService {

  constructor(private http: HttpClient) { }

  private URL = environment.apiUrl;
  private baseUrl = './assets/data/';

  // getAños
  getAños(): Observable<Iaño[]> {
    return this.http.get<Iaño[]>(this.baseUrl + 'Años.json');
  }

  getAñoById(idAño: string): Observable<Iaño> {
    return this.http.get<Iaño>(this.baseUrl + 'Años.json/' + idAño);
    //return this.http.get<Iaño>(this.URL + '/años' + idAño, {params: params});
  }

  // getRegiones
  getRegiones(): Observable<Iregion[]> {
    return this.http.get<Iregion[]>(this.baseUrl + 'regiones.json');
  }

  getRegionById(RegionId: string): Observable<Iregion> {
    return this.http.get<Iregion>(this.baseUrl + 'regiones.json/' + RegionId);
  }

  // getProvincias
  getProvincias(): Observable<Iprovincia[]> {
    /* return this.http.get<Iprovincia[]>(this.baseUrl);  */
    return this.http.get<Iprovincia[]>(this.baseUrl + 'provincias.json');
  }

  getProvinciasByRegion(idRegion: number): Observable<Iprovincia[]> {
    /* return this.http.get<Iprovincia[]>(this.baseUrl + idRegion);  */
    return this.http.get<Iprovincia[]>(this.baseUrl + 'provincias.json').pipe(
      map(provincias =>
        provincias.filter(provincia => provincia.RegionId == idRegion)
      )
    );
  }

  getProvinciaById(ProvinciaId: string): Observable<Iprovincia> {

    return this.http.get<Iprovincia>(this.baseUrl + 'provincias.json/' + ProvinciaId);
  }

  // getMunicipios
  getMunicipios(): Observable<Imunicipio[]> {
    return this.http.get<Imunicipio[]>(this.baseUrl + 'municipios.json');
  }

  getMunicipiosByProvincia(key: number): Observable<Imunicipio[]> {
    return this.http.get<Imunicipio[]>(this.baseUrl + 'municipios.json').pipe(
      map(municipios =>
        municipios.filter(municipio => municipio.ProvinceKey == key)
      )
    );
  }

  getMunicipioById(MunicipioId: string): Observable<Imunicipio> {

    return this.http.get<Imunicipio>(this.baseUrl + 'municipios.json/' + MunicipioId);
  }

  // getDistritos
  getDistritos(): Observable<IdistritoMunicipal[]> {
    return this.http.get<IdistritoMunicipal[]>(this.baseUrl + 'distritosMunicipales.json');
  }

  getDistritoById(DistritoId: string): Observable<IdistritoMunicipal> {
    return this.http.get<IdistritoMunicipal>(this.baseUrl + 'distritosMunicipales.json/' + DistritoId);
  }

  getDistritosByMunicipio(key: number): Observable<IdistritoMunicipal[]> {
    return this.http.get<IdistritoMunicipal[]>(this.baseUrl + 'distritosMunicipales.json').pipe(
      map(distritos =>
        distritos.filter(distrito => distrito.MunicipioKey == key)
      )
    );
  }

  // getEjes
  getEjes(): Observable<IejeEnd[]> {
    return this.http.get<IejeEnd[]>(this.baseUrl + 'ejesEnd.json');
  }

  getEjeById(EjeId: string): Observable<IejeEnd> {
    return this.http.get<IejeEnd>(this.baseUrl + 'ejesEnd.json/' + EjeId);
  }

  // getObjetivos
  getObjetivos(): Observable<IobjetivoEnd[]> {
    return this.http.get<IobjetivoEnd[]>(this.baseUrl + 'objetivosEnd.json');
  }

  getObjetivoById(ObjetivoId: string): Observable<IobjetivoEnd> {
    return this.http.get<IobjetivoEnd>(this.baseUrl + 'objetivosEnd.json/' + ObjetivoId);
  }

  getObjetivosByEjeId(ejeId:number): Observable<IobjetivoEnd[]> {
    return this.http.get<IobjetivoEnd[]>(this.baseUrl + 'objetivosEnd.json').
    pipe(
      map(objetivos =>
        objetivos.filter(objetivo => objetivo.EjeId == ejeId)
      )
    );
  }

  // getEstados
  getEstados(): Observable<IestadoEjecucion[]> {
    return this.http.get<IestadoEjecucion[]>(this.baseUrl + 'estadoEjecucion.json');
  }

  getEstadoById(EstadoId: string): Observable<IestadoEjecucion> {
    return this.http.get<IestadoEjecucion>(this.baseUrl + 'estadoEjecucion.json/' + EstadoId);
  }

  // getFuentes
  getFuentes(): Observable<IfuenteDemanda[]> {
    return this.http.get<IfuenteDemanda[]>(this.baseUrl + 'fuenteDemandas.json');
  }

  getFuenteById(FuenteId: string): Observable<IfuenteDemanda> {
    return this.http.get<IfuenteDemanda>(this.baseUrl + 'fuenteDemandas.json/' + FuenteId);
  }

  // getInstituciones
  getInstituciones(): Observable<Iinstitucion[]> {
    return this.http.get<Iinstitucion[]>(this.baseUrl + 'Instituciones.json');
  }

  getInstitucionById(InstitucionId: string): Observable<Iinstitucion> {
    return this.http.get<Iinstitucion>(this.baseUrl + 'Instituciones.json/' + InstitucionId);
  }


  // getPoliticas
  getPoliticas(): Observable<Ipolitica[]> {
    return this.http.get<Ipolitica[]>(this.baseUrl + 'politicas.json');
  }

  getPoliticaById(PoliticaId: string): Observable<Ipolitica> {
    return this.http.get<Ipolitica>(this.baseUrl + 'politicas.json/' + PoliticaId);
  }

  // getTecnicos
  getTecnicos(): Observable<Itecnico[]> {
    return this.http.get<Itecnico[]>(this.baseUrl + 'tecnicoOMPP.json');
  }

  getTecnicoById(Id: string): Observable<Itecnico> {
    return this.http.get<Itecnico>(this.baseUrl + 'tecnicoOMPP.json/' + Id);
  }

  // getTipoInversion
  getTipoInversion(): Observable<ItipoInversion[]> {
    return this.http.get<ItipoInversion[]>(this.baseUrl + 'tipoInversion.json');
  }

  getTipoInversionById(Id: string): Observable<ItipoInversion> {
    return this.http.get<ItipoInversion>(this.baseUrl + 'tipoInversion.json/' + Id);
  }

  // getTipoBeneficiarios
  getTipoBeneficiarios(): Observable<ItipoBeneficiario[]> {
    return this.http.get<ItipoBeneficiario[]>(this.baseUrl + 'tipoBeneficiario.json');
  }

  getTipoBeneficiariosById(Id: string): Observable<ItipoBeneficiario> {
    return this.http.get<ItipoBeneficiario>(this.baseUrl + 'tipoBeneficiario.json/' + Id);
  }

   // getCategoriaBeneficiarios
   getCategoriasBeneficiarios(): Observable<IcategoriaBeneficiario[]> {
    return this.http.get<IcategoriaBeneficiario[]>(this.baseUrl + 'categoriaBeneficiario.json');
  }

  getCategoriaBeneficiariosById(Id: string): Observable<IcategoriaBeneficiario> {
    return this.http.get<IcategoriaBeneficiario>(this.baseUrl + 'categoriaBeneficiario.json/' + Id);
  }
}
