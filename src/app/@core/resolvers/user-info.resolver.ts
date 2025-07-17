import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { of, tap } from 'rxjs';
import { AuthenticationService } from '../service/authentication.service';

export const UserInfoResolver: ResolveFn<any> = (route, state) => {
  const authService = inject(AuthenticationService);
  authService.setUserInfo();
  return of(authService.getUserInfo());
};
