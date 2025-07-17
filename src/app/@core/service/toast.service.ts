import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Toast } from '../model/toast/toast';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  // private _message$ = new BehaviorSubject<{ message: string, type: 'error' | 'warning' | 'info' | 'success' } | null>(null);
  // readonly message$ = this._message$.asObservable();

  // show(message: string, type: 'error' | 'warning' | 'info' | 'success' = 'info') {
  //   this._message$.next({ message, type });
  // }

  // clear() {
  //   this._message$.next(null);
  // }

    private toastSubject = new Subject<Toast>();
  toast$ = this.toastSubject.asObservable();

  show(message: string, type: Toast['type'] = 'info', delay = 3000) {
    this.toastSubject.next({ message, type, delay });
  }
}