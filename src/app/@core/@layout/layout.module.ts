import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { UiCoreModule } from '../ui-core.module';
import { OverlayLeftSideMenuComponent } from './side-menu/overlay-left-side-menu/overlay-left-side-menu.component';


@NgModule({
  declarations: [
    HeaderComponent,
    OverlayLeftSideMenuComponent,
  ],
  imports: [
    CommonModule,
    UiCoreModule
  ],
  exports: [
    HeaderComponent,
    OverlayLeftSideMenuComponent,
  ]
})
export class LayoutModule { }
