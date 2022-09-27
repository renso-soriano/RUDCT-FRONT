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
import { DropdownRequest } from '../models/Core/DropdownRequest.model';
import { DropdownResponse } from '../models/Core/DropdownResponse.model';

@Injectable({
  providedIn: "root",
})
export class DropDownServiceService {

  constructor(private http: HttpClient) { }

  private URL = environment.apiUrl;
  private baseUrl = './assets/data/';

  // getAños
  getAños(): Iaño[] {
    const startYear = environment.appStartYear;
    const actualYear = new Date().getFullYear();
    return this.calculateYears(startYear,actualYear);
  }

  getAñoById(idAño: string): Observable<Iaño> {
    return this.http.get<Iaño>(this.baseUrl + "Años.json/" + idAño);
    //return this.http.get<Iaño>(this.URL + '/años' + idAño, {params: params});
  }

  // getRegiones
  getRegiones(): Observable<DropdownResponse[]> {
    const contentBody: DropdownRequest = new DropdownRequest().deserialize({ nombreLista: 'REGIONES' });
    return this.http.post<DropdownResponse[]>(`${this.URL}Listas/GetDropdown`, contentBody);
  }

  getRegionById(RegionId: string): Observable<Iregion> {
    return this.http.get<Iregion>(this.baseUrl + "regiones.json/" + RegionId);
  }

  // getProvincias
  getProvincias(): Observable<Iprovincia[]> {
    let body = {
      nombreLista: "PROVINCIAS",
      padreId: null
    };
    return this.http.post<Iprovincia[]>(this.URL + "Listas/GetDropdown", body);
  }

  getProvinciasByRegion(idRegion: number): Observable<DropdownResponse[]> {
    if(idRegion > 0) {
      const contentBody: DropdownRequest = new DropdownRequest().deserialize({ nombreLista: 'PROVINCIAS', padreId: idRegion });
      return this.http.post<DropdownResponse[]>(`${this.URL}Listas/GetDropdown`, contentBody);
    }

  }

  getProvinciaById(ProvinciaId: string): Observable<Iprovincia> {
    return this.http.get<Iprovincia>(
      this.baseUrl + "provincias.json/" + ProvinciaId
    );
  }

  // getMunicipios
  getMunicipios(): Observable<Imunicipio[]> {
    //return this.http.get<Imunicipio[]>(this.URL );
    let body = {
      nombreLista: "MUNICIPIOS",
      padreId: null
    };
    return this.http.post<Imunicipio[]>(this.URL + "Listas/GetDropdown", body);
  }

  getMunicipiosByProvincia(key: any): Observable<DropdownResponse[]> {
    if(key > 0) {
      const contentBody: DropdownRequest = new DropdownRequest().deserialize({ nombreLista: 'MUNICIPIOS', padreId: key });
      return this.http.post<DropdownResponse[]>(`${this.URL}Listas/GetDropdown`, contentBody);
    }
  }

  getMunicipioById(MunicipioId: string): Observable<Imunicipio> {
    return this.http.get<Imunicipio>(
      this.baseUrl + "municipios.json/" + MunicipioId
    );
  }

  // getDistritos
  getDistritos(): Observable<IdistritoMunicipal[]> {
    return this.http.get<IdistritoMunicipal[]>(
      this.baseUrl + "distritosMunicipales.json"
    );
  }

  getDistritoById(DistritoId: string): Observable<IdistritoMunicipal> {
    return this.http.get<IdistritoMunicipal>(
      this.baseUrl + "distritosMunicipales.json/" + DistritoId
    );
  }

  getDistritosByMunicipio(key: any): Observable<DropdownResponse[]> {
    if(key > 0) {
      const contentBody: DropdownRequest = new DropdownRequest().deserialize({ nombreLista: 'DISTRITOS', padreId: key, extraInfo:null });
      return this.http.post<DropdownResponse[]>(`${this.URL}Listas/GetDropdown`, contentBody);
    }
  }

  // getEjes
  getEjes(): Observable<DropdownResponse[]> {
    const contentBody: DropdownRequest = new DropdownRequest().deserialize({ nombreLista: 'EJE_END', padreId: null, extraInfo:null });
    return this.http.post<DropdownResponse[]>(`${this.URL}Listas/GetDropdown`, contentBody);
  }

  getEjeById(EjeId: string): Observable<IejeEnd> {
    return this.http.get<IejeEnd>(this.baseUrl + "ejesEnd.json/" + EjeId);
  }

  // getODS
  getODS(): Observable<DropdownResponse[]> {
    const contentBody: DropdownRequest = new DropdownRequest().deserialize({ nombreLista: 'ODS', padreId: null, extraInfo:null });
    return this.http.post<DropdownResponse[]>(`${this.URL}Listas/GetDropdown`, contentBody);
  }

  // getObjetivos
  getObjetivos(): Observable<DropdownResponse[]> {
    const contentBody: DropdownRequest = new DropdownRequest().deserialize({ nombreLista: 'OBJETIVO_END', padreId: null, extraInfo:null });
    return this.http.post<DropdownResponse[]>(`${this.URL}Listas/GetDropdown`, contentBody);
  }

  getObjetivoById(ObjetivoId: string): Observable<IobjetivoEnd> {
    return this.http.get<IobjetivoEnd>(
      this.baseUrl + "objetivosEnd.json/" + ObjetivoId
    );
  }

  getObjetivosByEjeId(ejeId: number): Observable<DropdownResponse[]> {
    const contentBody: DropdownRequest = new DropdownRequest().deserialize({ nombreLista: 'OBJETIVO_END', padreId: ejeId, extraInfo:null });
    return this.http.post<DropdownResponse[]>(`${this.URL}Listas/GetDropdown`, contentBody);
  }

  // getEstados
  getEstados(): Observable<DropdownResponse[]> {
    const contentBody: DropdownRequest = new DropdownRequest().deserialize({ nombreLista: 'ESTADOS', padreId: null, extraInfo:null });
    return this.http.post<DropdownResponse[]>(`${this.URL}Listas/GetDropdown`, contentBody);
  }

  getEstadoById(EstadoId: string): Observable<IestadoEjecucion> {
    return this.http.get<IestadoEjecucion>(
      this.baseUrl + "estadoEjecucion.json/" + EstadoId
    );
  }

  // getEstadosValidacion
  getEstadosValidacion(): Observable<DropdownResponse[]> {
    const contentBody: DropdownRequest = new DropdownRequest().deserialize({ nombreLista: 'ESTADOS_VALIDACION', padreId: null, extraInfo:null });
    return this.http.post<DropdownResponse[]>(`${this.URL}Listas/GetDropdown`, contentBody);
  }
  // getEstadosValidacionById
  getEstadosValidacionById(idPadre): Observable<DropdownResponse[]> {
    const contentBody: DropdownRequest = new DropdownRequest().deserialize({ nombreLista: 'ESTADOS_VALIDACION', padreId: idPadre, extraInfo:null });
    return this.http.post<DropdownResponse[]>(`${this.URL}Listas/GetDropdown`, contentBody);
  }

   // getTipoDemandas
   getTiposDemandas(): Observable<DropdownResponse[]> {
    const contentBody: DropdownRequest = new DropdownRequest().deserialize({ nombreLista: 'TIPOS_DEMANDAS', padreId: null, extraInfo:null });
    return this.http.post<DropdownResponse[]>(`${this.URL}Listas/GetDropdown`, contentBody);
  }

  // getFuentes
  getFuentes(): Observable<DropdownResponse[]> {

    const contentBody: DropdownRequest = new DropdownRequest().deserialize({ nombreLista: 'FUENTE_DEMANDA', padreId: null, extraInfo:null });
    return this.http.post<DropdownResponse[]>(`${this.URL}Listas/GetDropdown`, contentBody);

  }

  getFuenteById(FuenteId: string): Observable<IfuenteDemanda> {
    return this.http.get<IfuenteDemanda>(
      this.baseUrl + "fuenteDemandas.json/" + FuenteId
    );
  }

  // getInstituciones
  getInstituciones(): Observable<DropdownResponse[]> {
    const contentBody: DropdownRequest = new DropdownRequest().deserialize({ nombreLista: 'INSTITUCIONES', padreId: null, extraInfo:null });
    return this.http.post<DropdownResponse[]>(`${this.URL}Listas/GetDropdown`, contentBody);
  }

  getInstitucionById(InstitucionId: number):  Observable<DropdownResponse[]> {
    const contentBody: DropdownRequest = new DropdownRequest().deserialize({ nombreLista: 'INSTITUCIONES', padreId: InstitucionId, extraInfo:null });
    return this.http.post<DropdownResponse[]>(`${this.URL}Listas/GetDropdown`, contentBody);
  }

  // getPoliticas
  getPoliticas(): Observable<DropdownResponse[]> {
    const contentBody: DropdownRequest = new DropdownRequest().deserialize({ nombreLista: 'POLITICA_PNPSP', padreId: null, extraInfo:null });
    return this.http.post<DropdownResponse[]>(`${this.URL}Listas/GetDropdown`, contentBody);
  }

  getTemasComunes(): Observable<DropdownResponse[]> {
    const contentBody: DropdownRequest = new DropdownRequest().deserialize({ nombreLista: 'TEMA_COMUN', padreId: null, extraInfo:'temaComun' });
    return this.http.post<DropdownResponse[]>(`${this.URL}Listas/GetDropdown`, contentBody);
  }

  getClasificadorByTemaComun(tema:any): Observable<DropdownResponse[]> {
    const contentBody: DropdownRequest = new DropdownRequest().deserialize({ nombreLista: 'CLASIFICADOR_FUNCIONAL', padreId: tema, extraInfo:null });
    return this.http.post<DropdownResponse[]>(`${this.URL}Listas/GetDropdown`, contentBody);
  }

  getPoliticaById(PoliticaId: string): Observable<Ipolitica> {
    return this.http.get<Ipolitica>(
      this.baseUrl + "politicas.json/" + PoliticaId
    );
  }

  // getTecnicos
  getTecnicos(padreId: number): Observable<DropdownResponse[]> {
    const contentBody: DropdownRequest = new DropdownRequest().deserialize({ nombreLista: 'TECNICO_OMPP', padreId: padreId, extraInfo:null });
    return this.http.post<DropdownResponse[]>(`${this.URL}Listas/GetDropdown`, contentBody);
  }

  getTecnicoById(Id: string): Observable<Itecnico> {
    return this.http.get<Itecnico>(this.baseUrl + "tecnicoOMPP.json/" + Id);
  }

  // getTipoInversion
  getTipoInversion(): Observable<DropdownResponse[]> {
    const contentBody: DropdownRequest = new DropdownRequest().deserialize({ nombreLista: 'TIPO_INVERSION' });
    return this.http.post<DropdownResponse[]>(`${this.URL}Listas/GetDropdown`, contentBody);
  }

  getTipoInversionById(Id: string): Observable<ItipoInversion> {
    return this.http.get<ItipoInversion>(
      this.baseUrl + "tipoInversion.json/" + Id
    );
  }


  getTipoDemandaById(Id: string): Observable<ItipoInversion> {
    return this.http.get<ItipoInversion>(
      this.baseUrl + "tipoInversion.json/" + Id
    );
  }


  // getTipoBeneficiarios
  getTipoBeneficiarios(): Observable<DropdownResponse[]> {
    const contentBody: DropdownRequest = new DropdownRequest().deserialize({ nombreLista: 'BENEFICIARIO_TIPO' });
    return this.http.post<DropdownResponse[]>(`${this.URL}Listas/GetDropdown`, contentBody);
  }

  getTipoBeneficiariosById(Id: string): Observable<ItipoBeneficiario> {
    return this.http.get<ItipoBeneficiario>(
      this.baseUrl + "tipoBeneficiario.json/" + Id
    );
  }

  // getCategoriaBeneficiarios
  getCategoriasBeneficiarios(): Observable<DropdownResponse[]> {
    const contentBody: DropdownRequest = new DropdownRequest().deserialize({ nombreLista: 'BENEFICIARIO_CATEGORIA' });
    return this.http.post<DropdownResponse[]>(`${this.URL}Listas/GetDropdown`, contentBody);
  }

  getCategoriaBeneficiariosById(
    Id: string
  ): Observable<IcategoriaBeneficiario> {
    return this.http.get<IcategoriaBeneficiario>(
      this.baseUrl + "categoriaBeneficiario.json/" + Id
    );
  }

  calculateYears(start: number, end: number): Iaño[] {
    let arr = new Array(end - start + 1);
    for (let i = 0; i < arr.length; i++, start++) {
      arr[i] = {
        id: start,
        Year: start.toString(),
        Activo: 1
      };
    }
    return arr;
  }
}
