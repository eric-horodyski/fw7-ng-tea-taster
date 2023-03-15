import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { from, mergeMap, Observable, tap } from 'rxjs';
import { SessionVaultService } from '../session-vault/session-vault.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private sessionVault: SessionVaultService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return from(this.sessionVault.get()).pipe(
      tap((session) => {
        if (session && this.requestRequiresToken(req)) {
          req = req.clone({
            setHeaders: {
              // eslint-disable-next-line @typescript-eslint/naming-convention
              Authorization: 'Bearer ' + session.token,
            },
          });
        }
      }),
      mergeMap(() => next.handle(req))
    );
  }

  private requestRequiresToken(req: HttpRequest<any>): boolean {
    return !/\/login$/.test(req.url);
  }
}
