import { HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { catchError } from 'rxjs/operators';
import { Route, Router } from '@angular/router';
import { SweetAlertService } from 'app/shared/components/sweet-alert/sweet-alert.service';

@Injectable({
  providedIn: 'root'
})
export class InterceptorService {
  constructor(
    private _router: Router,
    private _sas: SweetAlertService,
    private authService: AuthService,
  ) { }


  handleError(error: HttpErrorResponse) {
    if (error instanceof HttpErrorResponse) {
      // Server side error
      console.warn('Server side error')
      return throwError(error)
    } else {
      // Client side error
      console.warn('Client side error')
      return throwError(error)
    }
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const headersRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${this.authService.getToken()}`,
        // Accept: 'application/json',
        // "Content-Type": 'application/json'
      }
    });

    return next.handle(headersRequest).pipe(
      catchError((error) => {
        if (error instanceof HttpErrorResponse) {
          if (error.status === 401) {
            this.logout();
          }
        }
        return this.handleError(error)
      })
    );
  }
  logout() {
    this.authService.logOut();
    this._sas.error('Para continuar, Inicie sesión nuevamente', 'Su sesión ha expirado')
      .then(() => this._router.navigate(['auth/login']))
  }
}
