import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UtilityService {

 private Ls_SyncStorage$ = new Subject<void>();

  constructor() { }

  isValidInstance(data: any) {
    return (data !== undefined && data !== null);
  }

  isNotEmptyString(data: any) {
    let isValid = this.isValidInstance(data);
    if (isValid) {
      isValid = data.toString().trim().length > 0;
    }
    return isValid;
  }

  Ls_SyncStorage() {
      this.Ls_SyncStorage$.next();
  }

  getLsSyncStorageObservable() {
    return this.Ls_SyncStorage$.asObservable();
  }
}