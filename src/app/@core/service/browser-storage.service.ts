import { Injectable } from '@angular/core';
import { UtilityService } from './utility.service';

@Injectable({
  providedIn: 'root'
})
export class BrowserStorageService {

  constructor(private utilityService: UtilityService) { }

    // Set user info (merges with existing user info)
  LS_setUserInfo(data: any): void {
    const oldUserData = this.LS_getUserInfo();
    const newUserData = oldUserData ? { ...oldUserData, ...data } : data;
    localStorage.setItem('user', JSON.stringify(newUserData));
    this.utilityService.Ls_SyncStorage();
  }

  setIdToken(data:any):void{
    localStorage.setItem('id_token', data);
    this.utilityService.Ls_SyncStorage();
  }

  setAccessToken(data:any):void{
    localStorage.setItem('access_token', data);
    this.utilityService.Ls_SyncStorage();
  }

  setLoginError(data:any):void{
    localStorage.setItem('error', data);
    this.utilityService.Ls_SyncStorage();
  }

  setUserType(data:any):void{
    localStorage.setItem('userType', data);
    this.utilityService.Ls_SyncStorage();
  }

  getIdToken():any{
    const resultData = localStorage.getItem('id_token');
    if (!resultData) return null;

    try {
      return resultData;
    } catch (e) {
      console.error('Error parsing token:', e);
      return null;
    }
  }
  getAccessToken():any{
    const resultData = localStorage.getItem('access_token');
    if (!resultData) return null;

    try {
      return resultData;
    } catch (e) {
      console.error('Error parsing access token:', e);
      return null;
    }
  }

  // Get user info
  LS_getUserInfo(): any {
    const resultData = localStorage.getItem('user');
    if (!resultData) return null;

    try {
      return JSON.parse(resultData);
    } catch (e) {
      console.error('Error parsing user info:', e);
      return null;
    }
  }

  // Set app properties (merges with existing properties)
  Ls_SetAppProperties(data: any): void {
    const oldProps = this.Ls_GetAppProperties();
    const newProps = oldProps ? { ...oldProps, ...data } : data;
    localStorage.setItem('app_props', JSON.stringify(newProps));
    this.utilityService.Ls_SyncStorage();
  }

  // Get app properties
  Ls_GetAppProperties(): any {
    const resultData = localStorage.getItem('app_props');
    if (!resultData) return null;

    try {
      return JSON.parse(resultData);
    } catch (e) {
      console.error('Error parsing app_props:', e);
      return null;
    }
  }

  // Optional: clear user info
  LS_clearUserInfo(): void {
    localStorage.removeItem('user');
    this.utilityService.Ls_SyncStorage();
  }

  // Optional: clear app properties
  Ls_ClearAppProperties(): void {
    localStorage.removeItem('app_props');
    this.utilityService.Ls_SyncStorage();
  }

  LS_clear() {
    localStorage.clear();
    this.utilityService.Ls_SyncStorage(); 
  }

  SS_Clear() {    
    sessionStorage.clear();
    this.utilityService.Ls_SyncStorage(); 
  }
}
