// import { Injectable } from '@angular/core';

// @Injectable({
//   providedIn: 'root'
// })
// export class InterceptorService {

//   constructor() { }
// }


import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse, HttpInterceptor, HTTP_INTERCEPTORS, HttpResponse } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError, of, ObservableInput } from 'rxjs';
import { catchError, switchMap, filter, take, delay } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { AuthenticationService } from '../service/authentication.service';
import { AppConfigService } from '../service/app.config.service';
//import { DialogBoxComponent } from 'src/app/shared/components/dialog-box/dialog-box.component';

@Injectable({ providedIn: 'root' })
export class InterceptorService {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(
    null
  );

  constructor(
    public authentication: AuthenticationService,
    public appConfigService: AppConfigService,
    private dialog: MatDialog
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const deniedOrigins = ['oauth2/default/', 'assets/', 's3.amazonaws.com'];
    console.log(deniedOrigins);
    const allowedPaths = ['oauth2/default/v1/userinfo']; 
    const oktaToken = this.authentication.getOktaAccessToken(); //get okta access token
    if (!deniedOrigins.some((url) => request.urlWithParams.includes(url)) ||
        allowedPaths.some((path) => request.urlWithParams.endsWith(path))) {
      if (oktaToken !== undefined && oktaToken !== null) {
        request = this.addTokenToRequest(request, oktaToken);
      }
    }
    return next.handle(request).pipe(
      catchError((error: any) => {
        console.log(error.status);
        if(request.url.includes('/use-case'))
        {
          return of(new HttpResponse({status: 200, body:{data:[]} }));
        }
        if (error instanceof HttpErrorResponse && error.status === 401) {
          return this.handle401Error(request, next, error);
        } else if (error instanceof HttpErrorResponse && error.status === 403) {
          // this.openForbiddenDialog();
          
          return throwError(() => error);
        } 
        else if(error instanceof HttpErrorResponse && error.status === 500)
          {
            console.error('Forbidden error');
            return throwError(() => error);
          }
          else {
          return throwError(() => error);
        }
      })
    );
  }

  // private openForbiddenDialog(): void {
  //   this.dialog.open(DialogBoxComponent, {
  //     data: {
  //       content: `<div>
  //           <p>You dont have required permissions, please contact the <a href="mailto:alz-net@acr.org" style="cursor: pointer;">ALZ-NET Operations Team</a>.</p>
  //           </div>`,
  //       hasWarningImage: false,
  //       icon: `<span class="material-icons warning-yellow dialog-icon">
  //       warning
  //       </span>`,
  //     },
  //   });
  // }

  private addTokenToRequest(request: HttpRequest<any>, token: string) {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
        'x-api-key': `${this.appConfigService.environment.boomiConfig.boomiApiKey}`,
      },
    });
  }

  private handle401Error(
    request: HttpRequest<any>,
    next: HttpHandler,
    err: any
  ) {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      return of().pipe(
        delay(1000),
        switchMap(() => {
          this.isRefreshing = false;
          const oktaToken = this.authentication.getOktaAccessToken();
          this.refreshTokenSubject.next(oktaToken);
          if (oktaToken) {
            return next.handle(this.addTokenToRequest(request, oktaToken));
          } else {
            return throwError(() => err);
          }
        })
      );
    } else {
      return this.refreshTokenSubject.pipe(
        filter((token) => token !== undefined && token !== null),
        take(1),
        switchMap((token) => {
          return next.handle(this.addTokenToRequest(request, token));
        })
      );
    }
  }
}

export const InterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: InterceptorService, multi: true },
];