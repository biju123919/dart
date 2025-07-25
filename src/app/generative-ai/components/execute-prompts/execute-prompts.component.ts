import { Component, ElementRef, EventEmitter, inject, Input, OnInit, Output, QueryList, ViewChildren, ViewEncapsulation } from '@angular/core';
import {
  FormBuilder, FormGroup, Validators, FormControl, AbstractControl, ValidationErrors, FormArray
} from '@angular/forms';
import { GenerativeAIService } from '../../services/generative-ai.service';
import { ComputeConcordance, Model, Prompt } from '../../../@core/model/dto/entity.model';
import { PostExecutePromptPayload, SaveOrUpdatePromptPayload } from '../../../@core/model/dto/payload.dto';
import { Options } from '@angular-slider/ngx-slider';
import { SvgIcon } from 'src/app/@core/enums/svg-icon';
import { SessionStateService } from 'src/app/@core/state-management/session-state.service';

interface DropdownOption {
  value: string;
  label: string;
}

@Component({
  selector: 'app-execute-prompts',
  standalone: false,
  templateUrl: './execute-prompts.component.html',
  styleUrl: './execute-prompts.component.css',
  encapsulation: ViewEncapsulation.None
})
export class ExecutePromptsComponent implements OnInit {
  // Angular Inputs
  @Input() selectedPrompt: any;
  @Input() selectedPrompts: { [index: number]: any } = {};

  // Angular Outputs
  @Output() openPrompt = new EventEmitter<number>();
  @Output() promptTextChanged = new EventEmitter<any>();
  @Output() openModal = new EventEmitter<'load' | 'save'>();

  // ViewChild / ViewChildren
  @ViewChildren('promptDiv') promptDivs!: QueryList<ElementRef>;

  // Dependency Injection
  private fb = inject(FormBuilder);
  private generativeAIService = inject(GenerativeAIService);
  private sessionStateService = inject(SessionStateService);

  // Public UI State
  svgIcon = SvgIcon;
  activePromptIndex: number | null = null;

  // Prompt Properties
  promptLabels = ['Prompt A', 'Prompt B', 'Prompt C'];
  promptTexts: string[] = [];
  promptNames: string[] = [];
  promptIds: number[] = [];

  // Range Values
  valueStart = 0;
  valueEnd = 0;

  // Form
  promptForm = this.fb.group(
    {
      computeConcordanceBy: ['', Validators.required],
      model: [null, Validators.required],
      range: [[this.valueStart, this.valueEnd], [Validators.required, this.rangeValidator]],
      prompts: this.fb.array(
        this.promptLabels.map(() => this.fb.control('')),
        [this.atLeastOneFilledValidator]
      )
    }
  );

  // Concordances & Models
  computeConcordances: ComputeConcordance[] = [];
  models: Model[] = [];
  modelsAsOptions: { value: string; label: string }[] = [];
  computeConcordanceAsOptions: { value: string; label: string }[] = [];
  refreshingStates: boolean[] = [];

  // Session/User Info
  userId: string = '';
  useCaseId: string = '';

  // Editor & Prompt Display Control
  showEditor: { [key: number]: boolean } = {};
  promptTextContents: { [key: number]: string } = {};

  // Constants
  sliderOptions: Options = {
    floor: 0,
    ceil: 100,
    showSelectionBar: true,
    step: 1,
  };

  // Component State
  selectedCompute: { value: string; label: string } | null = null;
  selectedModel: { value: string; label: string } | null = null;

  // Angular lifecycle hooks
  ngOnChanges() {
    if (this.selectedPrompt && this.activePromptIndex !== null) {
      const promptText = this.selectedPrompt.promptText;
      const promptName = this.selectedPrompt.promptName;
      const promptId = this.selectedPrompt.id;

      const div = this.promptDivs.toArray()[this.activePromptIndex]?.nativeElement;
      if (div && div.innerText !== promptText) {
        div.innerText = promptText;
      }
      this.promptTexts[this.activePromptIndex] = promptText;
      this.promptNames[this.activePromptIndex] = promptName;
      this.promptIds[this.activePromptIndex] = promptId;
    }
  }

  ngOnInit(): void {
    this.useCaseId = localStorage.getItem('useCaseId') ?? '';
    this.userId = this.sessionStateService?.userDetails?.externalId;
    this.refreshingStates = this.prompts.controls.map(() => false);
    this.loadComputeConcordanceBy();
    this.loadModels();
  }

  ngAfterViewInit() {
    this.promptDivs.forEach((div, i) => {
      div.nativeElement.innerText = this.promptTexts[i] || '';
    });
  }

  // Public getters
  get rangeControl() {
    return this.promptForm.get('range') as FormControl;
  }

  get prompts(): FormArray {
    return this.promptForm.get('prompts') as FormArray;
  }

  getFormControl(name: string): FormControl {
    return this.promptForm.get(name) as FormControl;
  }

  getControlName(index: number): string {
    return ['textareaA', 'textareaB', 'textareaC'][index];
  }

  // Form validators
  rangeValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value || !Array.isArray(value) || value.length !== 2) {
      return { required: true };
    }
    const [start, end] = value;
    if (start === null || end === null || start >= end) {
      return { invalidRange: true };
    }
    return null;
  }

  atLeastOneFilledValidator(control: AbstractControl): ValidationErrors | null {
    const array = control as FormArray;
    const values = array.controls.map(c =>
      typeof c.value === 'string' ? c.value.trim() : ''
    );
    return values.some(v => v) ? null : { atLeastOneRequired: true };
  }

  atLeastOneTextareaFilled(control: AbstractControl): ValidationErrors | null {
    const group = control as FormGroup;
    const values = Object.values(group.controls).map((c) => {
      return typeof c.value === 'string' ? c.value.trim() : '';
    });
    return values.some((v) => v) ? null : { atLeastOneRequired: true };
  }
  // Form/data loading
  loadComputeConcordanceBy(): void {
    this.generativeAIService.getComputeConcordances().subscribe({
      next: (response: ComputeConcordance[]) => {
        this.computeConcordances = response ?? [];
        this.computeConcordanceAsOptions = this.computeConcordances.map(
          (computeCondordance) => ({
            value: computeCondordance.id.toString(),
            label: computeCondordance.label,
          })
        );
      },
      error: (err) => {
        console.error('Failed to load compute concordance:', err);
      },
    });
  }

  loadModels(): void {
    this.generativeAIService.getModels().subscribe({
      next: (response: Model[]) => {
        this.models = response ?? [];
        this.modelsAsOptions = this.models.map((model) => ({
          value: model.id.toString(),
          label: model.label,
        }));
      },
      error: (err) => {
        console.error('Failed to load model:', err);
      },
    });
  }

  // Event handlers (UI)
  onPromptChange() {
    this.prompts.updateValueAndValidity();
  }

  onSubmit(): void {
    if (this.promptForm.valid) {
      const reportsRange = this.promptForm.get('range')?.value;
      const modelControl = this.promptForm.get('model')?.value;
      const computeConcordanceByControl = this.promptForm.get('computeConcordanceBy')?.value;
      let modelValue: string | null = null;
      if (modelControl && typeof modelControl === 'object') {
        modelValue = (modelControl as DropdownOption).value;
      }

      let computeConcordanceByValue: string | null = null;
      if (computeConcordanceByControl && typeof computeConcordanceByControl === 'object') {
        computeConcordanceByValue = (computeConcordanceByControl as DropdownOption).value;
      }
      const promptTextValues = this.promptForm.value.prompts;
      console.log(this.promptIds);
      let promptATextId: any, promptBTextId: any, promptCTextId: any;
      [promptATextId, promptBTextId, promptCTextId] = this.promptIds;
      let promptA: any, promptB: any, promptC: any;
      if (Array.isArray(promptTextValues) && promptTextValues.length === 3) {
        [promptA, promptB, promptC] = promptTextValues;
      } else {
        console.warn('Invalid range selected');
      }

      let reportStart: any, reportEnd: any;
      if (Array.isArray(reportsRange) && reportsRange.length === 2) {
        [reportStart, reportEnd] = reportsRange;
      } else {
        console.warn('Invalid range selected');
      }

      const payload: PostExecutePromptPayload = {
        userId: this.userId,
        useCaseId: Number(this.useCaseId),
        computeConcordanceId: Number(computeConcordanceByValue),
        modelId: Number(modelValue),
        reportToProcessStart: reportStart,
        reportToProcessEnd: reportEnd,
        promptAId: promptATextId ?? null,
        promptBId: promptBTextId ?? null,
        promptCId: promptCTextId ?? null,
        PromptAText: promptA ?? '',
        PromptBText: promptB ?? '',
        PromptCText: promptC ?? '',
      };

      this.generativeAIService.postPromptExecution(payload).subscribe({
        next: (response) => {
          const id = response.data;
        },
        error: (err) => {
          console.log('An error occurred and was handled by the interceptor');
        },
      });
    } else {
      //alert('Form is invalid');
    }
  }

  onRefresh(index: number): void {
    this.promptTexts[index] = '';
    this.promptNames[index] = '';
    this.promptIds[index] = 0;
    const div = this.promptDivs.toArray()[index]?.nativeElement;
    if (div) {
      div.innerText = '';
    }
  }

  onComputeChange(selected: { value: string; label: string }) {
    this.selectedCompute = selected;
  }

  onModelChange(selected: { value: string; label: string }) {
    this.selectedModel = selected;
  }

  togglePromptText(index: number): void {
    this.showEditor[index] = true;
    setTimeout(() => {
      const div = this.promptDivs.toArray()[index]?.nativeElement;
      if (div) {
        div.innerText = this.promptTexts[index] || '';
      }
    });
  }

  onContentChange(event: Event, index: number): void {
    const value = (event.target as HTMLElement).innerText;
    this.promptTexts[index] = value;
    const promptsArray = this.promptForm.get('prompts') as FormArray;
    promptsArray.at(index).setValue(value);
    this.promptTextChanged.emit({ index, value });
  }

  onCollapsePrompt(index: number): void {
    const promptDiv = this.promptDivs.toArray()[index]?.nativeElement;
    if (promptDiv) {
      const text = promptDiv.innerText.trim();
      this.promptTextContents[index] = text;
    }
    this.showEditor[index] = false;
  }

  onSavePrompt(index: number): void {
    if (this.selectedPrompt) {
      this.selectedPrompt.promptName = this.promptNames[index];
      this.selectedPrompt.promptText = this.promptTexts[index];
      this.selectedPrompt.id = this.promptIds[index];
    }
    this.openModal.emit('save');
  }

  onLoadPrompt(i: number) {
    this.activePromptIndex = i;
    this.openModal.emit('load');
  }

  // Utility / Validation Helpers
  hasValidContent(index: number): boolean {
    return this.promptTexts[index]?.trim().length > 0;
  }
}