import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { AuthenticationService } from '../service/authentication.service';
import { BrowserStorageService } from '../service/browser-storage.service';
import { OverlayLoaderService } from '../service/overlay-loader.service';

interface UserInfo {
  email?: string;
  firstName?: string;
  lastName?: string;
  externalId?: string;
  name?: string;
  isUserLoggedIn?: boolean;
}

export const UserInfoResolver: ResolveFn<UserInfo> = (route, state) => {
  const authService = inject(AuthenticationService);
  const browserStorageService = inject(BrowserStorageService);
  const overlayLoader = inject(OverlayLoaderService);
  
  overlayLoader.showLoader();
  
  try {
    const idToken = authService.getOktaIdToken();
    const accessToken = authService?.getOktaAccessToken();
    const decodedIdToken = authService?.getDecodedAccessToken(idToken);
    const decodedAccessToken = authService?.getDecodedAccessToken(accessToken);

    let userDetails = browserStorageService.LS_getUserInfo();
    const fullName = decodedIdToken?.name?.split(' ') || [];
    const userData: UserInfo = {
      email: decodedIdToken?.email,
      firstName: fullName[0],
      lastName: fullName[fullName?.length - 1],
      externalId: decodedIdToken?.sub,
      name: decodedIdToken?.name,
    };
    
    browserStorageService.LS_setUserInfo(userData);
    userDetails = browserStorageService.LS_getUserInfo();
    
    if (userDetails) {
      userDetails.isUserLoggedIn = true;
      browserStorageService.LS_setUserInfo(userDetails);
    }
    
    return userDetails;
  } finally {
    overlayLoader.hideLoader();
  }
};