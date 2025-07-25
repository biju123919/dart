import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { UseCaseComponent } from './components/use-case/use-case.component';
import { MatRadioModule } from '@angular/material/radio';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDividerModule } from '@angular/material/divider';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../@core/old-shared/shared.module';
import { ExecutePromptsComponent } from './components/execute-prompts/execute-prompts.component';
import { DatasetComponent } from './components/dataset/dataset.component';
import { MatSliderModule } from '@angular/material/slider';
import { PromptComponent } from './modals/prompt/prompt.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { OldLayoutModule } from '../old-layout/old-layout.module';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { UiCoreModule } from '../@core/ui-core.module';
import { SaveEditPromptComponent } from './modals/save-edit-prompt/save-edit-prompt.component';

@NgModule({
  declarations: [
    DashboardComponent,
    UseCaseComponent,
    ExecutePromptsComponent,
    DatasetComponent,
    PromptComponent,
    SaveEditPromptComponent,
  ],
  imports: [
    CommonModule,
    MatRadioModule,
    MatExpansionModule,
    MatDividerModule,
    FormsModule,
    FormsModule,
    // SharedModule,
    ReactiveFormsModule,
    MatSliderModule,
    MatPaginatorModule,
    MatSelectModule,
    MatFormFieldModule,
    MatTableModule,
    MatIconModule,
    OldLayoutModule,
    SharedModule,
    NgxSliderModule,
    UiCoreModule
  ],
  exports: [DashboardComponent, UseCaseComponent]
})
export class GenerativeAIModule { }
