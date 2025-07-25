import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropdownComponent } from './components/dropdown/dropdown.component';
import { CommonTextareaComponent } from './components/common-textarea/common-textarea.component';
import { FormsModule, ControlValueAccessor, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { CommonRangeSliderComponent } from './components/common-range-slider/common-range-slider.component';
import { MatSliderModule } from '@angular/material/slider';
import { CommonPaginatorComponent } from './components/common-paginator/common-paginator.component';
import { CommonConfirmationModalComponent } from './components/common-confirmation-modal/common-confirmation-modal.component';
import { CommonSuccessModalComponent } from './components/common-success-modal/common-success-modal.component';
import { SaveModalComponent } from './components/save-modal/save-modal.component';
import { AccessDeniedComponent } from './components/access-denied/access-denied.component';
import { UiCoreModule } from '../ui-core.module';

@NgModule({
  declarations: [
    DropdownComponent,
    CommonTextareaComponent,
    CommonRangeSliderComponent,
    SaveModalComponent,
    SaveModalComponent,
    CommonPaginatorComponent,
    CommonConfirmationModalComponent,
    CommonSuccessModalComponent,
    AccessDeniedComponent,
    CommonPaginatorComponent,
    CommonConfirmationModalComponent,
    CommonSuccessModalComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatIconModule,
    MatDividerModule,
    MatSliderModule,
    ReactiveFormsModule,
    UiCoreModule
  ],
  exports: [
    DropdownComponent,
    CommonTextareaComponent,
    CommonRangeSliderComponent,
    CommonPaginatorComponent,
    AccessDeniedComponent,
    SaveModalComponent,
    AccessDeniedComponent,
  ],
})
export class SharedModule { }
