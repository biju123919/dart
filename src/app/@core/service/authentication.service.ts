import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';
import { JwksValidationHandler } from 'angular-oauth2-oidc-jwks';
import { BehaviorSubject, Observable } from 'rxjs';
import * as jwt_decode from 'jwt-decode';
import { AppConfigService } from './app.config.service';
import { User } from '../model/dto/entity.model';
import { BrowserStorageService } from './browser-storage.service';
import { OverlayLoaderService } from './overlay-loader.service';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {

  private loginStatus = new BehaviorSubject<boolean>(false);
  private decodedIdToken: any = null;
  user: User = { id: '', name: '', email: '' };
  private userInfo: any = null;

  constructor(
    private router: Router,
    private oauthService: OAuthService,
    private appConfigService: AppConfigService,
    private browserStorageService: BrowserStorageService,
    private overlayLoaderService: OverlayLoaderService,
  ) { }
  private isMenuVisible = new BehaviorSubject<boolean>(false);
  _isMenuVisible$ = this.isMenuVisible.asObservable();


  initializeCoreService() {
    this.initializeOAuth2Flow();
  }

  private initializeOAuth2Flow() {
    const config_settings = {
      issuer: this.appConfigService.environment.oktaConfig.issuer,
      redirectUri: this.appConfigService.environment.oktaConfig.redirectUrl,
      clientId: this.appConfigService.environment.oktaConfig.clientId,
      logoutUrl: this.appConfigService.environment.oktaConfig.logoutUrl,
      responseType: this.appConfigService.environment.oktaConfig.responseType,
      postLogoutRedirectUri:
        this.appConfigService.environment.oktaConfig.logoutUrl,
      silentRenew: true,
      useRefreshToken: true,
      ignoreNonceAfterRefresh: true,
      showDebugInformation: true,
      scope: this.appConfigService.environment.oktaConfig.scope,
      silentRefreshShowIFrame: false,
    };

    this.oauthService.configure(config_settings);

    this.oauthService.tokenValidationHandler = new JwksValidationHandler();
    this.oauthService.setupAutomaticSilentRefresh();

    this.oauthService
      .loadDiscoveryDocumentAndTryLogin()
      .then(() => {
        const id_token = sessionStorage.getItem('id_token');
        const access_token = sessionStorage.getItem('access_token');
        if (id_token && access_token) {
          this.browserStorageService.setIdToken(id_token);
          this.browserStorageService.setAccessToken(access_token);
          this.setLoginStatus(true);
        }
      })
      .catch((error) => {
        console.error('OAuth initialization error:', error);
      });
  }

  initializeLoginFlow() {
    this.oauthService.initCodeFlow();
  }

  setLoginStatus(status: boolean) {
    this.loginStatus.next(status);
  }

  getLoginStatus(): Observable<boolean> {
    return this.loginStatus.asObservable();
  }

  isUserLoggedIn(): boolean {
    return !!sessionStorage.getItem('id_token');
  }

oktaLogOut(noRedirect?: boolean) {
  const idToken = this.browserStorageService.getIdToken();
  if (!idToken) {
    this.clearSession();
    return;
  }

  try {
    this.overlayLoaderService?.showLoader();

    setTimeout(() => {
      try {
        this.oauthService?.logOut({
          id_token_hint: idToken,
          noRedirectToLogoutUrl: noRedirect || false,
        });

        // Clear local and session storage after logout request is sent
        this.browserStorageService.LS_clear();
        this.browserStorageService.SS_Clear();

        if (noRedirect) {
          this.overlayLoaderService?.hideLoader();
        }
      } catch (err) {
        console.error('Error during Okta logout in setTimeout:', err);
        this.overlayLoaderService?.hideLoader();
        this.setLoginError('Okta logout error!');
        this.redirectToLogout();
      }
    }, 100);
  } catch (err) {
    console.error('Outer logout error:', err);
    this.overlayLoaderService?.hideLoader();
    this.setLoginError('Okta logout error!');
    this.redirectToLogout();
  }

  this.clearSession();
}


  setLoginError(msg: string) {
    this.browserStorageService.setLoginError(msg);
  }

  redirectToLogout() {
    this.router.navigateByUrl('');
  }

  removeHistoryAfterLogout() {
    history.pushState(null, '', location.href);
    window.onpopstate = function () {
      history.go(1);
    };
  }

  getDecodedAccessToken(token: string): any {
    try {
      return jwt_decode.jwtDecode(token);
    } catch (Error) {
      return null;
    }
  }

  getOktaIdToken() {
    const sessionData = sessionStorage.getItem('id_token');
    if (sessionData) {
      this.browserStorageService.setIdToken(sessionData);
      return sessionData;
    }
    return this.browserStorageService.getIdToken();
  }

  getOktaAccessToken() {
    const sessionData = sessionStorage.getItem('access_token');
    if (sessionData) {
      this.browserStorageService.setAccessToken(sessionData);
    }
    return this.browserStorageService.getAccessToken();
  }

  getUserInfo(): any {
    return (
      this.userInfo || JSON.parse(localStorage.getItem('userInfo') || '{}')
    );
  }

  // Add this to your AuthenticationService class

  private userInfoSubject = new BehaviorSubject<any>(null);

  getUserInfo$(): Observable<any> {
    return this.userInfoSubject.asObservable();
  }

  // setUserInfo() {
  //   const idToken = this.getOktaIdToken();
  //   const decodedToken = this.getDecodedAccessToken(String(idToken));
  //   if (!decodedToken) {
  //     console.warn('Token not decoded!');
  //     return;
  //   }
  //   const userName = decodedToken?.name || '';
  //   const userEmail = decodedToken?.preferred_username || '';
  //   const userId = decodedToken?.sub || '';
  //   this.user = {
  //     id: userId,
  //     name: userName,
  //     email: userEmail,
  //   };
  //   this.userInfo = this.user;
  //   localStorage.setItem('userInfo', JSON.stringify(this.user));


  //   // Emit the user info change
  //   this.userInfoSubject.next(this.user);
  // }

  clearSession() {
    this.browserStorageService.LS_clear();
    this.browserStorageService.SS_Clear();
    this.removeHistoryAfterLogout();

    // Clear user info
    this.userInfo = null;
    this.userInfoSubject.next(null);
  }

  showMenu(data: boolean) {
    this.isMenuVisible.next(data);
  }

}
