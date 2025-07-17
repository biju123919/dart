import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, Observable } from 'rxjs';
import { SaveModalComponent } from '../components/save-modal/save-modal.component';
import { ModalConfig } from '../../model/dto/entity.model';

@Injectable({ providedIn: 'root' })
export class ModalService {
  private modalStack: ModalConfig[] = [];
  private modalSubject = new BehaviorSubject<ModalConfig | null>(null);

  constructor(private dialog: MatDialog) { }

  openModal(config: ModalConfig): void {
    this.modalStack.push(config);
    this.modalSubject.next(config);

    this.dialog.open(SaveModalComponent, {
      width: '400px',
      data: { config },
    });
  }

  closeModal(): void {
    this.modalStack.pop();
    const next = this.modalStack[this.modalStack.length - 1] || null;
    this.modalSubject.next(next);
  }

  getModalState(): Observable<ModalConfig | null> {
    return this.modalSubject.asObservable();
  }
}
