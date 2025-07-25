import { CanActivateFn, Router } from '@angular/router';
import { AuthenticationService } from '../service/authentication.service';
import { OverlayLoaderService } from '../service/overlay-loader.service';
import { inject } from '@angular/core';
import { SessionManagementService } from '../service/session-management.service';

export const oktaSsoGuard: CanActivateFn = async (route, state) => {
  const auth = inject(AuthenticationService);
  const router = inject(Router);
  const overlayLoader = inject(OverlayLoaderService);
  const sessionManager = inject(SessionManagementService);

  try {
    overlayLoader.showLoader();
    const { idToken, accessToken } = await waitForTokens(auth, 30, 200);
      if (!sessionManager.validateSession(accessToken)) {
      overlayLoader.hideLoader();
      return false;
    }

    overlayLoader.hideLoader();
    return true;
  } catch (error) {
    console.error('Guard token wait failed:', error);
    overlayLoader.hideLoader();
    router.navigate(['']);
    return false;
  }
};

function waitForTokens(auth: AuthenticationService, attempts = 10, delayMs = 1000): Promise<{ idToken: string, accessToken: string }> {
  return new Promise((resolve, reject) => {
    let tries = 0;
    const check = () => {
      const idToken = auth.getOktaIdToken();
      const accessToken = auth.getOktaAccessToken();
      if (idToken && accessToken) {
        resolve({ idToken, accessToken });
      } else if (++tries >= attempts) {
        reject('Tokens not available after retrying');
      } else {
        setTimeout(check, delayMs);
      }
    };
    check();
  });
};
