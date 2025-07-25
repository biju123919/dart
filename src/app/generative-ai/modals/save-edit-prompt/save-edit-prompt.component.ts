import { Component, EventEmitter, Input, Output, TemplateRef } from '@angular/core';

@Component({
  selector: 'app-save-edit-prompt',
  standalone: false,
  templateUrl: './save-edit-prompt.component.html',
  styleUrl: './save-edit-prompt.component.css',
})
export class SaveEditPromptComponent {
  @Input() title!: string;
  @Input() templateRef!: TemplateRef<any>;
  @Input() data: any = {};
  @Output() modalResult = new EventEmitter<any>();

  close(result: any) {
    this.modalResult.emit(result);
  }
}
