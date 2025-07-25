import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { GenerativeAIService } from '../../services/generative-ai.service';
import { Prompt } from '../../../@core/model/dto/entity.model';
import { DeletePromptPayload } from '../../../@core/model/dto/payload.dto';
import { SvgIcon } from 'src/app/@core/enums/svg-icon';
import { SessionStateService } from 'src/app/@core/state-management/session-state.service';

@Component({
  selector: 'app-prompt',
  standalone: false,
  templateUrl: './prompt.component.html',
  styleUrl: './prompt.component.css',
})
export class PromptComponent implements OnInit {
  // Angular built-in
  @Output() close = new EventEmitter<void>();
  @Output() promptSelected = new EventEmitter<any>();

  // Component state
  hover: boolean = false;
  hoveredIndex: number | null = null;
  activeIndex: number | null = null;
  selectedItem: any = null;
  itemToDelete: any;
  showDeleteModal: boolean = false;
  showDeleteConfirm: boolean = false;
  showConfirmationModal: boolean = false;

  // Data and UI config
  prompts: Prompt[] = [];
  pagedItems: any[] = [];
  totalItems: any;
  currentPage: number = 1;
  pageSize: number = 10;
  pageSizes: number[] = [10, 20, 50, 100, 200, 500, 1000];

  // Helpers
  svgIcon = SvgIcon;
  Math = Math;

  useCaseId: string = '';
  userId: string = '';

  private generativeAIService = inject(GenerativeAIService);
  private sessionStateService = inject(SessionStateService);

  // #region 🔁 Lifecycle Hooks
  ngOnInit(): void {
    console.log('333');
    this.userId = this.sessionStateService?.userDetails?.externalId;
    this.useCaseId = localStorage.getItem('useCaseId') ?? '';
    console.log(this.useCaseId);
    this.loadPrompts();
    console.log(this.pagedItems);
  }
  // #endregion

  // #region Data & Pagination
  loadPrompts(): void {
    this.generativeAIService
      .getPrompts(this.useCaseId, this.userId)
      .subscribe({
        next: (data: Prompt[]) => {
          console.log(data);
          this.prompts = data;
          console.log(this.prompts);
          this.updatePage();
          this.totalItems = this.prompts.length;
        },
        error: (err) => {
          console.error(err.message);
        },
      });
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.pageSize);
  }

  updatePage(): void {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.pagedItems = this.prompts.slice(start, end);
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePage();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePage();
    }
  }

  onPageSizeChange(): void {
    this.currentPage = 1;
    this.updatePage();
  }
  // #endregion

  // #region User Interaction
  toggleAccordion(index: number): void {
    this.activeIndex = this.activeIndex === index ? null : index;
  }

  onMouseEnter(index: number) {
    this.hoveredIndex = index;
  }

  onMouseLeave() {
    this.hoveredIndex = null;
  }

  selectPrompt() {
    console.log(this.selectedItem);
    if (this.selectedItem) {
      this.promptSelected.emit({
        id: this.selectedItem.id,
        promptName: this.selectedItem.promptName,
        promptText: this.selectedItem.promptText
      });
    }
  }
  // #endregion

  // #region Modal & Dialog Control
  closeModal() {
    this.close.emit();
  }

  openDeleteModal(item: any) {
    this.itemToDelete = item;
    this.showDeleteModal = true;
  }

  onCancel() {
    this.showDeleteModal = false;
    this.itemToDelete = null;
  }

  onConfirm() {
    this.showDeleteModal = false;
    this.deletePrompt(this.itemToDelete);
  }

  closeConfirmation() {
    this.showConfirmationModal = false;
  }
  // #endregion

  // #region Deletion
  deletePrompt(promptId: any) {
    const deletePrompt: DeletePromptPayload = {
      id: String(promptId),
      userId: this.userId
    };
    this.generativeAIService.deletePrompt(deletePrompt).subscribe({
      next: (data: Prompt[]) => {
        this.showConfirmationModal = true;
        this.loadPrompts();
      },
      error: (err) => {
        console.log('An error occurred and was handled by the interceptor');
      },
    });
  }
  // #endregion

}