import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/core/auth.service';
import { RouteInfo } from '../vertical-menu/vertical-menu.metadata';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  private userRole: string
  private authenticated: boolean = false

  constructor(private auth: AuthService, private router: Router) {

  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    let url: string = state.url;
    return this.checkUserRole(route, url);
  }

  async checkUserRole(route: ActivatedRouteSnapshot, url: any): Promise<boolean> {
    try {
      const modulo = this.findModule(route.routeConfig.path)
      if(modulo != null) {
        const permissions = await this.auth.getPermissions(modulo.id)
        if(permissions.acciones.length === 0) {
          this.router.navigate(['/content/unauthorized']);
          this.authenticated = false
        } else {
          this.authenticated = true
        }
      } else {
        this.router.navigate(['/content/unauthorized']);
          this.authenticated = false
      }

    } catch (err) {
      console.warn(err)
      //this.auth.logOut()
      this.authenticated = false
    }

    return this.authenticated
  }

  findModule(path: string): RouteInfo {
    const menu = this.auth.getMenu().find((e: RouteInfo) => e.path === `/${path}`)
    if(menu == undefined) {
      let subMenu: RouteInfo = null

      this.auth.getMenu().forEach((element: RouteInfo) => {
        const sub = element.submenu.find((e: RouteInfo) => e.path === `/${path}`)

        if(sub != undefined)
          subMenu = sub;
      })

      return subMenu
    } else {
      return menu
    }
  }

}
