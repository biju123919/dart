import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-common-success-modal',
  standalone: false,
  templateUrl: './common-success-modal.component.html',
})
export class CommonSuccessModalComponent {
  constructor(
    public dialogRef: MatDialogRef<CommonSuccessModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  onClose(): void {
    this.dialogRef.close('cancel');
  }
}
