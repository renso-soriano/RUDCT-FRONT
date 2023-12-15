import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AuthService } from '../services/core/auth.service';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  private authenticated: boolean = false

  constructor(private auth: AuthService, private router: Router) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.checkUserLogin()
  }

  async checkUserLogin(): Promise<boolean> {
    let result: boolean;
    if (this.auth.getToken() === '') {
      this.router.navigate(['/auth'])
      return false
    }

    try {
      const auth = await this.auth.loggedIn()
      this.authenticated = true //auth.is_logged
    } catch (err) {
      console.warn(err)
      this.authenticated = false
    }

    if (!this.authenticated) {
      this.router.navigate(['/auth']);
    }

    return this.authenticated
  }
}
