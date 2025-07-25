import { Injectable } from '@angular/core';
import { debounceTime, fromEvent, merge, Observable, Subject, takeUntil } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClientIdleService {
 private userActivitySubject = new Subject<void>();
  private destroy$ = new Subject<void>();

  constructor() {
    this.initializeActivityListeners();
  }

  private initializeActivityListeners(): void {
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];

    merge(...events.map(event => fromEvent(document, event)))
      .pipe(
        debounceTime(1000),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.userActivitySubject.next();
      });
  }

  onUserActivityDetected(): Observable<void> {
    return this.userActivitySubject.asObservable();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
