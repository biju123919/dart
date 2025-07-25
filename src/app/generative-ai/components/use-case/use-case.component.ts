import { Component, inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GENERATIVE_LOGO_TEXT } from '../../../@core/constants/global.constants';
import { LayoutService } from 'src/app/old-layout/services/layout.service';
import { Prompt } from 'src/app/@core/model/dto/entity.model';
import { GenerativeAIService } from '../../services/generative-ai.service';
import { SvgIcon } from 'src/app/@core/enums/svg-icon';
import { SaveOrUpdatePromptPayload } from 'src/app/@core/model/dto/payload.dto';
import { SessionStateService } from 'src/app/@core/state-management/session-state.service';
import { SharedService } from 'src/app/@core/old-shared/service/shared.service';

@Component({
  selector: 'app-use-case',
  standalone: false,
  templateUrl: './use-case.component.html',
  styleUrl: './use-case.component.css',
})
export class UseCaseComponent implements OnInit {
  // Injected Services
  private route = inject(ActivatedRoute);
  private layoutService = inject(LayoutService);
  private router = inject(Router);

  // Public properties
  project: string = '';
  useCase: string = '';
  isCollapsed: boolean = false;
  prompts: Prompt[] = [];
  isNameValid: boolean = false;
  updatedPromptText: string = '';
  userId: string = '';
  useCaseId: string = '';

  // Modal control flags
  isPromptModalOpen: boolean = false;
  isSaveModalOpen: boolean = false;

  // Modal-related data
  modalTitle: string = '';
  modalData: any = {};
  selectedPrompt: any;
  activeTemplate!: TemplateRef<any>;

  // ViewChild references
  @ViewChild('savePromptModal') savePromptModalTemplate!: TemplateRef<any>;
  @ViewChild('editPromptModal') editPromptModalTemplate!: TemplateRef<any>;
  @ViewChild('infoModal') infoModalTemplate!: TemplateRef<any>;

  // Icons
  svgIcon = SvgIcon;

  // Constructor
  constructor(private generativeAIService: GenerativeAIService, private sessionStateService: SessionStateService, private sharedService: SharedService<any>) { }

  // Lifecycle Hooks
  ngOnInit(): void {
    this.userId = this.sessionStateService?.userDetails?.externalId;
    this.useCaseId = localStorage.getItem('useCaseId') ?? '';
    this.layoutService.setTitle(GENERATIVE_LOGO_TEXT);
    if (this.route.snapshot) {
      this.useCase = this.route.snapshot.paramMap.get('useCase') ?? '';
      this.project = this.route.snapshot.paramMap.get('project') ?? '';
    }
  }

  // Navigation and Routing
  backArrowClick(): void {
    this.isCollapsed = !this.isCollapsed;
  }

  nextArrowClick(): void {
    this.isCollapsed = !this.isCollapsed;
  }

  backToDashboard() {
    this.router.navigate(['/dashboard']);
  }

  // Modal Management
  openModalFromParent(type: 'load' | 'save'): void {
    if (type === 'load') {
      this.isPromptModalOpen = true;
    } else if (type === 'save') {
      const promptId = this.selectedPrompt ? this.selectedPrompt.id : '';
      const promptName = this.selectedPrompt ? this.selectedPrompt.promptName : '';
      const promptText = this.selectedPrompt ? this.selectedPrompt.promptText : '';
      this.modalTitle = 'Save Prompt';
      this.modalData = { id: promptId, name: promptName, text: promptText };
      this.activeTemplate = this.savePromptModalTemplate;
      this.isSaveModalOpen = true;
      this.isNameValid = !!promptName && promptName.trim().length > 0 && promptName.length <= 100;
    }
  }

  closePromptModal(): void {
    this.isPromptModalOpen = false;
  }

  openEditPromptModal(savedValue: any): void {
    this.modalTitle = 'Save Prompt';
    this.modalData = { id: savedValue.id, name: savedValue.name, text: savedValue.text, message: `The entered Prompt Name already exists in the system. Do you want to overwrite it?` };
    this.activeTemplate = this.editPromptModalTemplate;
    this.isSaveModalOpen = true;
  }

  handleModalClose(action: string, data?: any): void {
    if (action === 'save') {
      const fullData = {
        id: data.id,
        text: data.text,
        name: data?.name
      };
      this.onModalResult({ action, data: fullData });
    }
    else if (action === 'yes') {
      const fullData = {
        id: data.id,
        text: data.text,
        name: data?.name,
        message: data?.message
      };
      this.onModalResult({ action, data: fullData });
    }
    else {
      this.onModalResult({ action, data });
    }
  }

  onModalResult(result: { action: string, data?: any }): void {
    this.isSaveModalOpen = false;

    if (result.action === 'save') {
      this.getPrompts(result.data);
    }

    if (result.action === 'yes') {
      this.createOrUpdatePrompt(result.data?.name, result.data?.text);
    }
  }

  // Prompt Handling
  getPrompts(promptDetails: any): void {
    let id = '';
    let name = '';
    let text = '';
    if (promptDetails) {
      id = promptDetails.id;
      name = promptDetails.name;
      text = promptDetails.text;
    }

    this.generativeAIService
      .getPrompts(this.useCaseId, this.userId)
      .subscribe({
        next: (data: Prompt[]) => {
          this.prompts = data;
          const exists = this.prompts.some(item => item.promptName === name);
          if (exists) {
            this.openEditPromptModal(promptDetails);
          }
          else {
            this.createOrUpdatePrompt(name, text);

          }
        },
        error: (err) => {
          console.error(err.message);
        },
      });
  }

  handlePromptSelected(prompt: any): void {
    this.selectedPrompt = prompt;
    this.isPromptModalOpen = false;
  }

  createOrUpdatePrompt(promptName: any, promptText: any): void {
    const payload: SaveOrUpdatePromptPayload = {
      promptName: promptName ?? '',
      promptText: promptText ?? '',
      useCaseId: this.useCaseId,
      userId: this.userId ?? '',
    };
    this.generativeAIService.saveOrUpdatePrompt(payload).subscribe({
      next: () => {
        this.showSuccessMessage('Your Prompt has been saved successfully!');
      },
      error: (err) => {
        console.log('An error occurred and was handled by the interceptor');
      },
    });
  }

  handlePromptUpdate(event: { name: string; value: string }) {
    const { name, value } = event;
    this.updatedPromptText = value;
  }


  onNameChange(name: string): void {
    this.isNameValid = !!name && name.trim().length > 0 && name.length <= 100;
  }

  // Utilities
  showSuccessMessage(message: string): void {
    this.modalTitle = '';
    this.modalData = { message };
    this.activeTemplate = this.infoModalTemplate;
    this.isSaveModalOpen = true;
  }
}