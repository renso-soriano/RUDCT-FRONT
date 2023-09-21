import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Grupo } from 'app/shared/models/grupo.model';
//import { Institucion } from 'app/shared/models/institucion';
import { Token } from 'app/shared/models/token.model';
import { RouteInfo } from 'app/shared/vertical-menu/vertical-menu.metadata';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private API_URL = environment.apiUrl;
  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  signIn(user: any): Observable<Token> {
    return this.http.post<any>(`${this.API_URL}Auth/Login`, user).pipe(
      map(
        res => {
          return res;
        }
      )
    );
  }

  async loggedIn(): Promise<any> {
    const response = await new Promise<any>((resolve, reject) => {
      this.http.get<any>(`${this.API_URL}Auth/GetPermissionsByModuleId/${81}`)
        .toPromise()
        .then(
          res => {
            resolve(res)
          },
        )
        .catch(
          err => {
            reject(err)
          }
        )
    })
    return response;
  }

  getToken(): string {
    const userdata: Token = JSON.parse(sessionStorage.getItem('userdata'));
    return userdata ? userdata.accessToken : '';
  }

  getUserId(): number {
    const userdata: Token = JSON.parse(sessionStorage.getItem('userdata'));
    return userdata ? userdata.usuario.id : null;
  }

  getMenu(): RouteInfo[] {
    const userdata: Token = JSON.parse(sessionStorage.getItem('userdata'));
    return userdata ? userdata.menu : [];
  }

  getUserCompleteName(): string {
    const userdata: Token = JSON.parse(sessionStorage.getItem('userdata'));
    return userdata && userdata.persona != null ? `${userdata.persona.firstName} ${userdata.persona.lastName}` : userdata ? userdata.usuario.username : '';
  }

  getUserLastName(): string {
    const userdata: Token = JSON.parse(sessionStorage.getItem('userdata'));
    return userdata && userdata.persona != null ? `${userdata.persona.lastName}` : '';
  }

  /* getPerfilName(): string {
    const userdata: Token = JSON.parse(sessionStorage.getItem('userdata'));
    return userdata ? `${userdata.persona.usuario.perfil.nombre}` : '';
  } */

  getInstitucion(): number {
    const userdata: Token = JSON.parse(sessionStorage.getItem('userdata'));
    return userdata.persona.institutionId;
  }

  getPersona(): any {
    const userdata: Token = JSON.parse(sessionStorage.getItem('userdata'));
    return userdata.persona;
  }


  getGrupos(): Grupo[] {
    const userdata: Token = JSON.parse(sessionStorage.getItem('userdata'));
    return userdata && userdata.grupos ? userdata.grupos : [];
  }

  findModule(path: string): RouteInfo {

    const menu = this.getMenu().find((e: RouteInfo) => e.path === `${path}`)
    if (menu == undefined) {
      let subMenu: RouteInfo = null

      this.getMenu().forEach((element: RouteInfo) => {
        const sub = element.submenu.find((e: RouteInfo) => e.path === `${path}`)

        if (sub != undefined)
          subMenu = sub;
      })

      return subMenu
    } else {
      return menu
    }
  }

  async getPermissions(moduloId: number): Promise<any> {
    const perfil = await new Promise<any>((resolve, reject) => {
      this.http.get<any>(`${this.API_URL}Auth/GetPermissionsByModuleId/${moduloId}`)
        .toPromise()
        .then(
          res => {
            resolve(res)
          },
        )
        .catch(
          err => {
            reject(err)
          }
        )
    })
    return perfil;
  }




  logOut(): void {
    sessionStorage.removeItem('userdata');
    this.router.navigate(['/auth']);

    // this.http.post<any>(`${this.API_URL}Auth/Logout`, null).subscribe(
    //   () => {
    //   }
    // );
  }

  async refreshToken(): Promise<any> {
    const response = await new Promise<any>((resolve, reject) => {
      this.http.post<any>(`${this.API_URL}Auth/Refresh`, null)
        .toPromise()
        .then(
          res => {
            resolve(res)
          },
        )
        .catch(
          err => {
            reject(err)
          }
        )
    })
    return response;
  }

  /*   changePassword(data: any): Observable<any> {
      return this.http.post<any>(`${this.API_URL}auth/ChangePassword`, data).pipe(
        map(
          res => {
            return new Token().deserialize(res.data);
          }
        )
      );
    } */

}
