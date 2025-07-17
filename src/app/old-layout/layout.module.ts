import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { SupportComponent } from './support/support.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { MatIconModule } from '@angular/material/icon';
import { UiCoreModule } from '../@core/ui-core.module';
// import { IconComponent } from '../@core/Components/Icons/icon.component';



@NgModule({
  declarations: [
    FooterComponent,
    HeaderComponent,
    WelcomeComponent,
    SupportComponent
  ],
  imports: [
    CommonModule,
    MatIconModule,
    // IconComponent
    UiCoreModule
  ],
  exports: [
    FooterComponent,
    HeaderComponent,
    WelcomeComponent,
    SupportComponent
  ]  
})
export class LayoutModule { }
