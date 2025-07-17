import { Component, inject, OnInit } from '@angular/core';
import { GenerativeAIService } from '../../services/generative-ai.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
// import { SharedService } from '../../../shared/service/shared.service';
// import { CommonConfirmationModalComponent } from '../../../shared/components/common-confirmation-modal/common-confirmation-modal.component';
// import { CommonSuccessModalComponent } from '../../../shared/components/common-success-modal/common-success-modal.component';
import { Prompt } from '../../../@core/model/dto/entity.model';
import { DeletePromptPayload } from '../../../@core/model/dto/payload.dto';

@Component({
  selector: 'app-prompt',
  standalone: false,
  templateUrl: './prompt.component.html',
})
export class PromptComponent implements OnInit {
  public dialogRef = inject(MatDialogRef<PromptComponent>);
  private generativeAIService = inject(GenerativeAIService);
  // private sharedService = inject<SharedService<any>>(SharedService);
  public dialog = inject(MatDialog);

  useCaseId?: string | number;
  prompts: Prompt[] = [];
  pagedData: Prompt[] = [];
  selectedIndex: number | null = null;
  selectedValue: any;
  pageSize = 10;
  currentPage = 1;
  pageSizeOptions: number[] = [10, 25, 50, 100];

  ngOnInit(): void {
    this.useCaseId = localStorage.getItem('useCaseId') ?? '';
    this.loadPrompts();
  }

  loadPrompts(): void {
    const userId = localStorage.getItem('userId') ?? '';
    this.generativeAIService
      .getPrompts(String(this.useCaseId), userId)
      .subscribe({
        next: (data: Prompt[]) => {
          this.prompts = data;
          this.updatePagedData();
          localStorage.setItem('promptData', JSON.stringify(this.prompts));
          // this.sharedService.setValue('prompts', this.prompts);
        },
        error: (err) => {
          console.error(err.message);
        },
      });
  }

  onPageChange(event: { pageIndex: number; pageSize: number }): void {
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.updatePagedData();
  }

  updatePagedData(): void {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.pagedData = this.prompts.slice(start, end);
  }

  togglePanel(index: number): void {
    this.selectedIndex = this.selectedIndex === index ? null : index;
  }

  onRadioButtonClick(event: any, itemId: number): void {
    event.stopPropagation();
    this.selectedValue = itemId;
  }

  onSelectPrompt(): void {
    const isSelectedPrompt = true;
    localStorage.setItem('isSelectedPrompt', JSON.stringify(isSelectedPrompt));
    const selectedItem = this.pagedData.find(
      (item) => item.id === this.selectedValue
    );
    const promptName = selectedItem ? selectedItem.promptName : '';
    const promptText = selectedItem ? selectedItem.promptText : '';
    const promptId = selectedItem ? selectedItem.id : '';
    localStorage.setItem('promptId', String(promptId));
    this.dialogRef.close({
      promptName: promptName,
      promptText: promptText,
      promptId: promptId,
    });
  }

  onClose(): void {
    this.selectedValue = null;
    this.dialogRef.close();
  }

  openConfirmDeleteModal(itemId: number): void {
    // const dialogRef = this.dialog.open(CommonConfirmationModalComponent, {
    //   width: '350px',
    //   data: { id: itemId },
    // });

    // dialogRef.afterClosed().subscribe((result) => {
    //   if (result === 'confirm') {
    //     this.deletePrompt(itemId);
    //   }
    // });
  }

  deletePrompt(index: number): void {
    if (this.selectedIndex === index) {
      this.selectedIndex = null;
    }
    const promptId = this.pagedData[index].id;

    const deletePrompt: DeletePromptPayload = {
      id: String(promptId),
      userId: localStorage.getItem('userId') ?? '',
    };
    this.generativeAIService.deletePrompt(deletePrompt).subscribe({
      next: (data: Prompt[]) => {
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
    // dialogRef.afterClosed().subscribe(() => {
    //   this.loadPrompts();
    // });
  }
}
