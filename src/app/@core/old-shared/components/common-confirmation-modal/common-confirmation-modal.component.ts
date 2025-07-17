import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-common-confirmation-modal',
  standalone: false,
  templateUrl: './common-confirmation-modal.component.html',
})
export class CommonConfirmationModalComponent {
constructor(
  public dialogRef: MatDialogRef<CommonConfirmationModalComponent>
) {}

onConfirm(): void {
  this.dialogRef.close('confirm');
}

onCancel(): void {
  this.dialogRef.close('cancel');
}
}
