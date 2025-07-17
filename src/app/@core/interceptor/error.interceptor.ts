import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { ToastService } from '../service/toast.service';

export const errorInterceptor: HttpInterceptorFn = (request, next) => {
  const snackBar = inject(MatSnackBar);
  const router = inject(Router);
  const toast = inject(ToastService);

  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      let message = 'An unexpected error occurred.';

      switch (error.status) {
        case 400:
          console.error('400: Bad Request', error);
          break;
        case 401:
          console.error('401: Unauthorized', error);
          break;
        case 403:
          console.error('403: Forbidden', error);
          break;
        case 500:
          console.error('500: Internal Server Error', error);
          break;
        default:
          console.error(`${error.status}: Unknown Error`, error);
      }

      message = 'Something went wrong. Please refresh and try again.';
      toast.show(message, 'error');

      return throwError(() => error);
    })
  );
};

function sessionExpiry(router: Router, toastr: ToastService): void {
  const toast = inject(ToastService);
  toast.show(
    'Your session has expired. Please log in again to continue.',
    'error'
  );
  localStorage.clear();
  router.navigate(['/login']);
}
