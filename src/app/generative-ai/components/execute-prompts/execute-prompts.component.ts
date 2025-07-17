import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
  AbstractControl,
  ValidationErrors,
  FormArray,
  ValidatorFn,
} from '@angular/forms';
import { GenerativeAIService } from '../../services/generative-ai.service';
import { PromptComponent } from '../../modals/prompt/prompt.component';
import { MatDialog } from '@angular/material/dialog';
// import { ModalService } from '../../../shared/service/modal.service';
// import { SharedService } from '../../../shared/service/shared.service';
// import { CommonSuccessModalComponent } from '../../../shared/components/common-success-modal/common-success-modal.component';
import { ComputeConcordance, Model, Prompt } from '../../../@core/model/dto/entity.model';
import { SavePromptPayload, UpdatePromptPayload } from '../../../@core/model/dto/payload.dto';

@Component({
  selector: 'app-execute-prompts',
  standalone: false,
  templateUrl: './execute-prompts.component.html',
  styleUrl: './execute-prompts.component.css',
})
export class ExecutePromptsComponent implements OnInit {
  private fb = inject(FormBuilder);
  private generativeAIService = inject(GenerativeAIService);
  public dialog = inject(MatDialog);
  // private modalService = inject(ModalService);

  computeConcordances: ComputeConcordance[] = [];
  models: Model[] = [];
  refreshingStates: boolean[] = [];
  promptsData: Prompt[] = [];
  promptData: Prompt[] = [];
  modelsAsOptions: { value: string; label: string }[] = [];
  computeConcordanceAsOptions: { value: string; label: string }[] = [];
  promptId: any;
  promptText: string = '';
  promptName: string = '';
  promptLabels = ['Prompt A', 'Prompt B', 'Prompt C'];
  useCaseId?: string | number;
  isLoadPrompt?: boolean;


  myForm = this.fb.group(
    {
      computeConcordanceBy: ['', Validators.required],
      model: [null, Validators.required],
      range: [0, [Validators.min(0), Validators.max(100)]],
      prompts: this.fb.array(
        [this.fb.control(''), this.fb.control(''), this.fb.control('')],
        [this.atLeastOnePromptRequiredValidator()]
      ),
    },
    { validators: this.atLeastOneTextareaFilled }
  );


  ngOnInit(): void {
    this.refreshingStates = this.prompts.controls.map(() => false);
    this.loadComputeConcordanceBy();
    this.loadModels();
    this.useCaseId = localStorage.getItem('useCaseId') ?? '';
  }

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

  onPromptChange() {
    this.prompts.updateValueAndValidity();
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

  onSubmit(): void {
    if (this.myForm.valid) {
      console.log('Form submitted:', this.myForm.value);
    } else {
      console.log('Form is not valid');
    }
  }

  getControlName(index: number): string {
    return ['textareaA', 'textareaB', 'textareaC'][index];
  }

  atLeastOneTextareaFilled(control: AbstractControl): ValidationErrors | null {
    const group = control as FormGroup;
    const values = Object.values(group.controls).map((c) => {
      return typeof c.value === 'string' ? c.value.trim() : '';
    });
    return values.some((v) => v) ? null : { atLeastOneRequired: true };
  }

  get rangeControl() {
    return this.myForm.get('range') as FormControl;
  }

  getFormControl(name: string): FormControl {
    return this.myForm.get(name) as FormControl;
  }

  get prompts(): FormArray {
    return this.myForm.get('prompts') as FormArray;
  }

  onSave(index: number) {
    this.openSavePromptModal(index);
    const isSelectedPrompt = false;
    localStorage.setItem('isSelectedPrompt', JSON.stringify(isSelectedPrompt));
  }

  openSavePromptModal(index: number) {
    const promptText = this.prompts.at(index).value;
    let promptName = this.promptName;
    const promptId = this.promptId;

    const storedValue = localStorage.getItem('isSelectedPrompt');
    const isSelectedPrompt = storedValue ? JSON.parse(storedValue) : false;

    if (isSelectedPrompt == false) {
      promptName = '';
    }

    // this.modalService.openModal({
    //   title: 'Save Prompt',
    //   content: 'Save your Prompt',
    //   onSave: (promptName?: string) =>
    //     this.openValidateNamePrompt(promptId, promptName, promptText, index),
    //   data: { promptName },
    //   confirmButtonText: 'Save',
    //   cancelButtonText: 'Close',
    // });
  }

  openValidateNamePrompt(
    promptId: any,
    promptName?: string,
    promptText?: string,
    index?: number
  ) {
    const promptsData = JSON.parse(localStorage.getItem('promptData') || '[]');
    const promtNameExists = promptsData.some(
      (f: Prompt) => f.promptName === promptName
    );

    if (!promtNameExists) {
      this.createPrompt(promptName, promptText);
    } else {
      // this.modalService.openModal({
      //   title: 'Save Prompt',
      //   content:
      //     'The entered Prompt Name already exists in the system. Do you want to overwrite it?',
      //   onSave: () => this.updatePrompt(promptId, promptName, promptText),
      //   isWarning: true,
      //   isNameExists: true,
      //   data: '',
      //   confirmButtonText: 'Yes',
      //   cancelButtonText: 'No',
      //   showDeclineIcon: true,
      // });
    }
    // this.promptsData = this.sharedService.getValue('prompts');

    //  const fff = this.promptsData?.find((f) => f.promptName == promptName);
    //  const eixts = this.promptData?.find((f) => f.promptName == promptName);

    // if (fff || eixts) {
    //   const promptExistName = this.promptName;
    //   let updatedPromptName = '';
    //   if (promptExistName == '') {
    //     updatedPromptName = this.promptName;
    //   }
    //   if (updatedPromptName == '') {
    //     updatedPromptName = String(promptName);
    //   }

    //   this.modalService.openModal({
    //     title: 'Save Prompt',
    //     content:
    //       'The entered Prompt Name already exists in the system. Do you want to overwrite it?',
    //     onSave: () => this.openLast(updatedPromptName, promptText),
    //     isWarning: true,
    //     data: '',
    //     showInput: true,
    //     confirmButtonText: 'Yes',
    //     cancelButtonText: 'No',
    //     showDeclineIcon: true,
    //     showSuccessIcon: false,
    //     showTitle: true,
    //   });
    // } else {
    //   {
    //     this.openLast(promptName, promptText);
    //   }
    // }
    this.prompts.at(Number(index)).setValue('');
  }

  createPrompt(promptName: any, promptText: any) {
    const payload: SavePromptPayload = {
      promptName: promptName ?? '',
      promptText: promptText ?? '',
      useCaseId: String(this.useCaseId),
      userId: localStorage.getItem('userId') ?? '',
    };
    this.generativeAIService.savePrompt(payload).subscribe({
      next: () => {
        this.openSuccessModal();
      },
      error: (err) => {
        console.log('An error occurred and was handled by the interceptor');
      },
    });
  }

  updatePrompt(promptId: any, promptName: any, promptText: any) {
    const payload: UpdatePromptPayload = {
      id: promptId,
      promptName: promptName ?? '',
      promptText: promptText ?? '',
      useCaseId: String(this.useCaseId),
      userId: localStorage.getItem('userId') ?? '',
    };
    this.generativeAIService.updatePrompt(payload).subscribe({
      next: () => {
        this.openSuccessModal();
      },
      error: (err) => {
        console.log('An error occurred and was handled by the interceptor');
      },
    });
  }

  openSuccessModal(): void {
    // const dialogRef = this.dialog.open(CommonSuccessModalComponent, {
    //   data: { message: 'Your Prompt has been successfully deleted.!' },
    // });
    // dialogRef.afterClosed().subscribe(() => { });
  }

  // openLast(promptName?: string, promptText?: string) {
  //   const userId = '1';
  //   this.promptsData = this.sharedService.getValue('prompts');
  //   const promptExists = this.promptsData?.find(
  //     (f) => f.promptName == promptName
  //   );
  //   const promptId = this.sharedService.getValue('promptId');
  //   if (promptExists) {
  //     const payload: UpdatePromptPayload = {
  //       id: promptId,
  //       promptName: promptName ?? '',
  //       promptText: promptText ?? '',
  //       useCaseId: String(this.useCaseId),
  //       userId: userId,
  //     };
  //     this.generativeAIService.updatePrompt(payload).subscribe({
  //       next: () => {
  //         this.modalService.openModal({
  //           content: 'Your Prompt has been saved successfully!',
  //           onSave: () => {
  //             this.modalService.closeModal();
  //           },
  //           data: undefined,
  //           // showInput: false,
  //           showTitle: false,
  //           showSuccessIcon: true,
  //           title: '',
  //         });
  //       },
  //       error: (err) => {
  //         console.log('An error occurred and was handled by the interceptor');
  //       },
  //     });
  //   } else {
  //     const payload: SavePromptPayload = {
  //       promptName: promptName ?? '',
  //       promptText: promptText ?? '',
  //       useCaseId: String(this.useCaseId),
  //       userId: userId,
  //     };
  //     this.generativeAIService.savePrompt(payload).subscribe({
  //       next: () => {
  //         // this.modalService.openModal({
  //         //   content: 'Your Prompt has been saved successfully!',
  //         //   onSave: () => {
  //         //     this.modalService.closeModal();
  //         //   },
  //         //   data: undefined,
  //         //   showInput: false,
  //         //   showTitle: false,
  //         //   showSuccessIcon: true,
  //         //   title: '',
  //         // });
  //         //  this.modalService.openModal({
  //         //   content: 'Your Prompt has been saved successfully!',
  //         //   onSave: () => {
  //         //     this.modalService.closeModal();
  //         //   },
  //         //   data: undefined,
  //         //   showInput: false,
  //         //   showOkButton: true,
  //         //   showTitle: false,
  //         //   showSuccessIcon: true,
  //         //   title: '',
  //         // });
  //       },
  //       error: (err) => {
  //         console.log('An error occurred and was handled by the interceptor');
  //       },
  //     });
  //   }
  // }

  onLoad(index: number): void {
    const dialogRef = this.dialog.open(PromptComponent, {
      disableClose: true,
      data: {
        currentValue: this.prompts.at(index).value,
        useCaseId: this.useCaseId,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.promptText = result?.promptText;
      this.promptName = result?.promptName;
      this.promptId = result?.promptId;
      //       const storedValue = localStorage.getItem('isSelectedPrompt');
      // const isSelectedPrompt = storedValue ? JSON.parse(storedValue) : false;
      if (result) {
        this.prompts.at(index).setValue(result.promptText);
      }
      console.log('Dialog closed with result:', result);
    });
  }

  onRefresh(index: number): void {
    this.prompts.at(index).setValue('');
    this.refreshingStates[index] = true;
    this.prompts.markAsPristine();
    this.prompts.updateValueAndValidity();
    this.refreshingStates[index] = true;
    setTimeout(() => {
      this.refreshingStates[index] = false;
    }, 500);
  }

  private atLeastOnePromptRequiredValidator(): ValidatorFn {
    return (formArray: AbstractControl): ValidationErrors | null => {
      const controls = (formArray as FormArray).controls;
      const hasAtLeastOne = controls.some(
        (control) => control.value && control.value.trim().length > 0
      );
      return hasAtLeastOne ? null : { atLeastOneRequired: true };
    };
  }
}
