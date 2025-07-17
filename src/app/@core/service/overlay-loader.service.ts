import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OverlayLoaderService {
  private loadingSubject = new BehaviorSubject<boolean>(false);

  // Expose as readonly observable
  readonly loading$: Observable<boolean> = this.loadingSubject.asObservable();

  constructor() {}

  /** Use to get the current loader value (if really needed synchronously) */
  get loaderStatus(): boolean {
    return this.loadingSubject.getValue(); // safer than `.value`
  }

  /** Show loader globally */
  showLoader(): void {
    this.loadingSubject.next(true);
  }

  /** Hide loader globally */
  hideLoader(): void {
    this.loadingSubject.next(false);
  }
}
