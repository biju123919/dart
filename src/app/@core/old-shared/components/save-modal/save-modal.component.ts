import { Component, inject, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ModalService } from '../../service/modal.service';
import { ModalConfig } from 'src/app/@core/model/dto/entity.model';

@Component({
  selector: 'app-save-modal',
  standalone: false,
  templateUrl: './save-modal.component.html',
  styleUrl: './save-modal.component.css',
})
export class SaveModalComponent implements OnInit {
  dialogRef = inject(MatDialogRef<SaveModalComponent>);
  data = inject<{ config: ModalConfig }>(MAT_DIALOG_DATA);
  private modalService = inject(ModalService);

  config = this.data.config;
  promptName: string = '';

  ngOnInit(): void {
    this.modalService.getModalState().subscribe((config) => {
      if (config?.data?.promptName) {
        this.promptName = config.data.promptName;
      }
    });
  }

  save(): void {
    if (this.config.onSave) {
      this.config.onSave(this.promptName);
    }
    this.closeModal();
  }

  closeModal(): void {
    this.modalService.closeModal();
    this.dialogRef.close();
  }
}
