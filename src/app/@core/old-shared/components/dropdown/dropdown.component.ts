import {
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  HostListener,
  Input,
  OnInit,
  Output,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { SvgIcon } from 'src/app/@core/enums/svg-icon';

@Component({
  selector: 'dropdown',
  standalone: false,
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DropdownComponent),
      multi: true
    }
  ],
  encapsulation: ViewEncapsulation.None,
})
export class DropdownComponent implements ControlValueAccessor {
  @Input() options: { value: string; label: string }[] = [];
  @Input() placeholder: string = 'Select';

  @Output() selectionChanged = new EventEmitter<{ value: string; label: string }>();

  selected: { value: string; label: string } | null = null;
  isOpen = false;
  isDisabled = false;
  svgIcon = SvgIcon;
  hover: boolean = false;
  @ViewChild('dropdownRef') dropdownRef!: ElementRef;

  onChange = (_: any) => { };
  onTouched = () => { };

  writeValue(value: { value: string; label: string } | null): void {
    this.selected = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  toggleDropdown() {
    if (!this.isDisabled) {
      this.isOpen = !this.isOpen;
    }
  }

  selectOption(option: { value: string; label: string }, event: Event) {
    event.stopPropagation();
    this.selected = option;
    this.onChange(option);
    this.selectionChanged.emit(option);
    this.isOpen = false;
  }
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    const target = event.target as HTMLElement;

    if (this.isOpen) {
      const clickedInsideDropdown = this.dropdownRef?.nativeElement.contains(target);

      if (!clickedInsideDropdown) {
        this.isOpen = false;
      }
    }
  }
}
