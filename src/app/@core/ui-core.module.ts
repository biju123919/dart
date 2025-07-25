import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogBoxComponent } from './Components/dialog-box/dialog-box.component';
import { OktaAccessComponent } from './Components/okta-access/okta-access.component';
import { OktaSignupComponent } from './Components/okta-signup/okta-signup.component';
import { TimeoutWarningModalComponent } from './Components/timeout-warning-modal/timeout-warning-modal.component';
import { ToastComponent } from './Components/toast/toast.component';
import { IconComponent } from './Components/Icons/icon.component';
import { OverlayLoaderComponent } from './Components/overlay-loader/overlay-loader.component';
import { DialogComponent } from './Components/dialog/dialog.component';


@NgModule({
  declarations: [
    DialogBoxComponent,
    OktaAccessComponent,
    OktaSignupComponent,
    ToastComponent,
    TimeoutWarningModalComponent,
    IconComponent,
    OverlayLoaderComponent,
    DialogComponent,
  ],
  imports: [
    CommonModule
  ],
  exports: [
    DialogBoxComponent,
    OktaAccessComponent,
    OktaSignupComponent,
    ToastComponent,
    TimeoutWarningModalComponent,
    IconComponent,
    OverlayLoaderComponent,
  ]
})
export class UiCoreModule { }
