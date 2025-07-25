import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { debounceTime, Subject, takeUntil } from 'rxjs';
import { AuthenticationService } from './authentication.service';
import { ClientIdleService } from './client-idle.service';
import { DialogService } from './dialog.service';

@Injectable({
  providedIn: 'root'
})
export class SessionManagementService {
private ngUnsubscribe$ = new Subject();
  private dialogOpen = false;
  private inactivityTimeout = 1 * 60 * 1000;

  constructor(
    private router: Router,
    private authService: AuthenticationService,
    private clientIdleService: ClientIdleService, 
    private dialogService: DialogService,
  ) {}

  checkTokenExpiry(exp: number): boolean {
    if (exp < (new Date().getTime() + 1) / 1000) {
      return false;
    }
    return true;
  }

  startInactivityDetection(): void {
    this.clientIdleService
      .onUserActivityDetected()
      .pipe(
        debounceTime(this.inactivityTimeout),
        takeUntil(this.ngUnsubscribe$)
      )
      .subscribe(() => {
        if (!this.dialogOpen) {
          this.openSessionExpiredDialog();
        }
      });
  }

  private openSessionExpiredDialog(): void {
    this.dialogOpen = true;

    ['popstate', 'unload'].forEach((event) => {
      window.addEventListener(event, () => {
        this.authService.oktaLogOut();
      }, { once: true });
    });

    const htmlContent = `
      <div class="session-expired-dialog">
        <div class="text-center mb-4">
          <div class="alert alert-warning modal-title-lg" role="alert">
            Your session has expired!
          </div>
        </div>
        
        <div class="mb-4">
          <p class="fs-6 modal-body-text">
            Please login again to continue using your app.
          </p>
        </div>
        
        <div class="d-flex justify-content-center">
          <button id="sessionExpiredConfirmBtn" class="btn btn-primary fs-6 px-3" type="button">
            Login Again
          </button>
        </div>
      </div>
    `;

    this.dialogService.openWithHtml(htmlContent, {
      position: 'center',
      size: 'md',
      width: '400px',
      onConfirm: () => {
        this.handleSessionExpired();
      },
      onButtonClick: (buttonId: string) => {
        if (buttonId === 'sessionExpiredConfirmBtn') {
          this.handleSessionExpired();
        }
      }
    });
  }

  private handleSessionExpired(): void {
    this.dialogOpen = false;
    this.dialogService.close(); 
    window.location.href = "/";
  }

  validateSession(accessToken: string): boolean {
    if (!accessToken) {
      return false;
    }

    try {

      const decodedToken = this.decodeJWTToken(accessToken);
      
      if (!this.checkTokenExpiry(decodedToken.exp)) {
        if (!this.dialogOpen) {
          this.openSessionExpiredDialog();
        }
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Token validation error:', error);
      return false;
    }
  }

  private decodeJWTToken(accessToken: string): any {
    try {
      const payload = accessToken.split('.')[1];
      const decodedPayload = atob(payload);
      return JSON.parse(decodedPayload);
    } catch (error) {
      throw new Error('Invalid token format');
    }
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe$?.next(null);
    this.ngUnsubscribe$?.complete();
  }
}
