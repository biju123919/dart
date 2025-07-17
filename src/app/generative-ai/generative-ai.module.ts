import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { UseCaseComponent } from './components/use-case/use-case.component';
import { MatRadioModule } from '@angular/material/radio';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDividerModule } from '@angular/material/divider';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { SharedModule } from '../shared/shared.module';
import { ExecutePromptsComponent } from './components/execute-prompts/execute-prompts.component';
import { DatasetComponent } from './components/dataset/dataset.component';
import { MatSliderModule } from '@angular/material/slider';
import { PromptComponent } from './modals/prompt/prompt.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { LayoutModule } from '../old-layout/layout.module';

@NgModule({
  declarations: [
    DashboardComponent,
    UseCaseComponent,
    ExecutePromptsComponent,
    DatasetComponent,
    PromptComponent,
  ],
  imports: [
    CommonModule,
    MatRadioModule,
    MatExpansionModule,
    MatDividerModule,
    FormsModule,
    LayoutModule,
    ReactiveFormsModule,
    MatSliderModule,
    MatPaginatorModule,
    MatSelectModule,
    MatFormFieldModule,
    MatTableModule,
    MatIconModule
  ],
  exports: [DashboardComponent, UseCaseComponent]
})
export class GenerativeAIModule { }
