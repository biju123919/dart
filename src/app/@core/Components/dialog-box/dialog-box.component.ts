
import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { AuthenticationService } from '../../../@core/service/authentication.service';

@Component({
  selector: 'app-dialog-box',
  standalone: false,
  templateUrl: './dialog-box.component.html'
})
export class DialogBoxComponent {
  constructor(private dialogRef: MatDialogRef<DialogBoxComponent>, private authentication: AuthenticationService,) {}

  onStart(): void {
    this.dialogRef.close('start');
  }
  onCancel(): void {
    this.dialogRef.close('cancel');
    this.authentication.oktaLogOut();
  }
}
