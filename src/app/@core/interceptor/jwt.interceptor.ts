import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { Router } from '@angular/router';
import { inject } from '@angular/core';
import { finalize, tap } from 'rxjs';
import { AppConfigService } from '../service/app.config.service';
import { ToastService } from '../service/toast.service';
import { LoaderService } from '../service/loader.service';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const appConfigService = inject(AppConfigService);
  const router = inject(Router);
  const toastr = inject(ToastService);
  const loaderService = inject(LoaderService);

  const env = appConfigService.environment;
  if (!env) {
    return next(req);
  }

  const apiUrls: string[] = Object.values(env.api || {}) as string[];
  const shouldIntercept = apiUrls.some(
    (url) => !!url && req.url.startsWith(url)
  );

  if (!shouldIntercept) {
    return next(req);
  }

  const token = localStorage.getItem('access_token');
  if (!token) {
    return next(req);
  }
  const authReq = req.clone({
    headers: req.headers.set('Authorization', `Bearer ${token}`),
  });

  loaderService.setLoading(true);

  return next(authReq).pipe(
    tap({
      error: (err: any) => {
        if (err instanceof HttpErrorResponse && err.status === 401) {
          sessionExpiry(router, toastr);
        }
      },
    }),
    finalize(() => {
      loaderService.setLoading(false);
    })
  );
};

function sessionExpiry(router: Router, toastr: ToastService): void {
  toastr.show(
    'Your session has expired. Please log in again to continue.',
    'error'
  );
  localStorage.clear();
  router.navigate(['/login']);
}
