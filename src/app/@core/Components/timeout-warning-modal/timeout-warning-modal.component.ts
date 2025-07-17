import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../../@core/service/authentication.service';

@Component({
  selector: 'app-timeout-warning-modal',
  standalone: false,
  templateUrl: './timeout-warning-modal.component.html'
})
export class TimeoutWarningModalComponent {
  constructor(
    public dialogRef: MatDialogRef<TimeoutWarningModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { message: string },
    private router: Router, private authentication: AuthenticationService 
  ) { }

  onConfirm(): void {
    this.dialogRef.close();
    this.authentication.oktaLogOut();
  }
}
