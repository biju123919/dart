import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConfigService } from './app.config.service';
import { MatDialog } from '@angular/material/dialog';
import { User } from '../model/dto/entity.model';

@Injectable({
  providedIn: 'root',
})
export class UserManageService {
  userRegistrationUrl = '';
  userDetailsUrl = '';
  oktaBaseUrl = '';
  private readonly HARDCODED_EMAIL = 'binayak.b@mwebware.com';

  httpOtions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  constructor(private appConfigService: AppConfigService) {
    this.userRegistrationUrl =
      this.appConfigService.environment?.api.userRegistration;
    this.userDetailsUrl = this.appConfigService.environment?.api.userDetails;
    this.oktaBaseUrl = this.appConfigService.environment?.oktaConfig?.issuer;
  }

  checkEmail(email: string): boolean {
    return email.toLowerCase() === this.HARDCODED_EMAIL.toLowerCase();
  }

  getUserInfo(): User | null {
    const resultData = localStorage.getItem('user');
    if (!resultData) return null;
    try {
      return JSON.parse(resultData) as User;
    } catch (e) {
      console.error('Error parsing user info:', e);
      return null;
    }
  }

  setUserInfo(user: any, isEmailMatch: any) {
    try {
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('isEmailMatch', JSON.stringify(isEmailMatch));
    } catch (e) {
      console.error('Error storing user info:', e);
    }
  }
}
