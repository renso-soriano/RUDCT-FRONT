import { HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class InterceptorService {
  constructor(
    private authService: AuthService,
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const headersRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${this.authService.getToken()}`,
        // Accept: 'application/json',
        // "Content-Type": 'application/json'
      }
    });

    return next.handle(headersRequest);
  }
}
