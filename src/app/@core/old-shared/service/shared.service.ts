import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SharedService<T> {
  private dataSubject = new BehaviorSubject<T>({} as T);
  data$: Observable<T> = this.dataSubject.asObservable();

  setValue<K extends keyof T>(key: K, value: T[K]): void {
    const current = this.dataSubject.value;
    this.dataSubject.next({ ...current, [key]: value });
  }

  getValue<K extends keyof T>(key: K): T[K] | undefined {
    return this.dataSubject.value[key];
  }

  getAll(): T {
    return this.dataSubject.value;
  }

  clear(): void {
    this.dataSubject.next({} as T);
  }
}
