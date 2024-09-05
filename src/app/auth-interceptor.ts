import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SharedService } from './shared.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  
  constructor(private sharedService: SharedService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const sessionKey = this.sharedService.getSessionKey();

    // Clone the request and add the Authorization header if the sessionKey exists
    if (sessionKey) {
      const clonedReq = req.clone({
        headers: req.headers.set('X-Session-Key', `${sessionKey}`)
      });
      return next.handle(clonedReq);
    }

    // If no sessionKey, forward the request without modifications
    return next.handle(req);
  }
}
