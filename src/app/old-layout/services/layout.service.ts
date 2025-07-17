import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DART_LOGO_TEXT } from '../../@core/constants/global.constants';

@Injectable({
  providedIn: 'root'
})
export class LayoutService {
  private titleSubject = new BehaviorSubject<string>(DART_LOGO_TEXT);
  title$ = this.titleSubject.asObservable();

  private userEmailSubject = new BehaviorSubject<string | null>(null);
  userEmail$ = this.userEmailSubject.asObservable();

  constructor() { }

  setTitle(title: string) {
    this.titleSubject.next(title);
  }

  setUserEmail(email: string) {
    this.userEmailSubject.next(email);
  }
}
