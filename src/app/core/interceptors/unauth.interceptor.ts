import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { NavController } from '@ionic/angular';
import { SessionVaultService } from '../session-vault/session-vault.service';

@Injectable()
export class UnauthInterceptor implements HttpInterceptor {
  constructor(private navController: NavController, private sessionVault: SessionVaultService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      tap(
        (event: HttpEvent<any>) => {},
        async (err: any) => {
          if (err instanceof HttpErrorResponse && err.status === 401) {
            await this.sessionVault.clear();
            this.navController.navigateRoot(['/login']);
          }
        }
      )
    );
  }
}
