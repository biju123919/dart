import { Injectable } from '@angular/core';
import { UtilityService } from '../service/utility.service';

@Injectable({
  providedIn: 'root'
})
export class SessionStateService {
  private _isUserLoggedIn: boolean = false;
  private _userDetails: any;

  constructor(private utilityService: UtilityService) {
    this.Ls_LoadFromStorage();
    this.subscribeToStorageSync();
  }

  Ls_LoadFromStorage() {
    const storedData = localStorage?.getItem('user');
    
    if (storedData) {
      this._userDetails = JSON.parse(storedData);
      this._isUserLoggedIn = this._userDetails?.isUserLoggedIn || false
    } else {
      this.resetUserSessionState();
    }

  }
    private subscribeToStorageSync(): void {
    this.utilityService.getLsSyncStorageObservable().subscribe(() => {
      this.Ls_LoadFromStorage();
    });
  }


  private resetUserSessionState(): void {
    this._isUserLoggedIn = false;
  }

  get isUserLoggedIn() {
    return this._isUserLoggedIn
  }

  set isUserLoggedIn(data: any) {
    this._isUserLoggedIn = data;
  }

  get userDetails(): any {
    return this._userDetails;
  }

  set userDetails(value: any) {
    this._userDetails = value;
  }
}
