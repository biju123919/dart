import { CanActivateFn, Router } from '@angular/router';
import { Inject, inject } from '@angular/core';
import { debounceTime, Observable, of, Subject, takeUntil } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { AuthenticationService } from '../service/authentication.service';
import { IdleTimeoutService } from '../service/idle-timeout.service';
import { TimeoutWarningModalComponent } from '../Components/timeout-warning-modal/timeout-warning-modal.component';


export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthenticationService);
  const router = inject(Router);
  const idleTimeoutService = inject(IdleTimeoutService);
  const dialog = inject(MatDialog);
  const accessToken = authService.getOktaAccessToken();
  if (accessToken) {
    const decodedToken = authService.getDecodedAccessToken(accessToken);
    if (authService.isUserLoggedIn() && checkTokenExpiry(decodedToken.exp)) {
      startInactivityDetection(idleTimeoutService, dialog);
      return of(true);
    }
    openInactiveDialog(dialog);
  }
  router.navigateByUrl('/login');
  return of(false);
};

function checkTokenExpiry(exp: number): boolean {
  const currentTime = Date.now() / 1000;
  return exp > currentTime;
}

function startInactivityDetection(
  inactivityService: IdleTimeoutService,
  dialog: MatDialog
): void {
  const stop$ = new Subject<void>();
  inactivityService
    .onUserActivityDetected()
    .pipe(debounceTime(20 * 60 * 1000), takeUntil(stop$))
    .subscribe(() => {
      openInactiveDialog(dialog);
      stop$.next();
      stop$.complete();
    });
}

function openInactiveDialog(dialog: MatDialog): void {
  const timeoutMessage =
    'Your session has expired due to inactivity. Please login again.';
  dialog.open(TimeoutWarningModalComponent, {
    width: '400px',
    disableClose: true,
    data: { message: timeoutMessage },
  });
}
