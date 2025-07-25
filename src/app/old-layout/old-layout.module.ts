import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './footer/footer.component';
import { SupportComponent } from './support/support.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { MatIconModule } from '@angular/material/icon';
import { UiCoreModule } from '../@core/ui-core.module';

@NgModule({
  declarations: [
    FooterComponent,
    WelcomeComponent,
    SupportComponent
  ],
  imports: [
    CommonModule,
    MatIconModule,
    UiCoreModule
  ],
  exports: [
    FooterComponent,
    WelcomeComponent,
    SupportComponent
  ]  
})
export class OldLayoutModule { }
