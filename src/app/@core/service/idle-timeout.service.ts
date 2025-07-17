import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subject, takeUntil } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class IdleTimeoutService implements OnDestroy {
  private userActivity$: Subject<void> = new Subject<void>();
  private ngUnsubscribe$: Subject<void> = new Subject<void>();

  constructor() {
    this.subscribeToUserActivity();
  }

  private subscribeToUserActivity(): void {
    const events = ['keypress', 'click', 'wheel', 'mousemove', 'touchstart'];
    events.forEach(event =>
      document.addEventListener(event, this.onUserActivity)
    );
  }

  private onUserActivity = (): void => {
    this.userActivity$.next();
  };

  public onUserActivityDetected(): Observable<void> {
    return this.userActivity$.pipe(takeUntil(this.ngUnsubscribe$));
  }

  ngOnDestroy(): void {
    const events = ['keypress', 'click', 'wheel', 'mousemove', 'touchstart'];
    events.forEach(event =>
      document.removeEventListener(event, this.onUserActivity)
    );

    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }
}