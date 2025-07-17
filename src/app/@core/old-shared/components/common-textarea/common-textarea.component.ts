import { Component, EventEmitter, Input, Output, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NG_VALIDATORS, AbstractControl, ValidationErrors, FormControl } from '@angular/forms';

@Component({
  selector: 'app-common-textarea',
  standalone: false,
  templateUrl: './common-textarea.component.html',
  styleUrls: ['./common-textarea.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CommonTextareaComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => CommonTextareaComponent),
      multi: true
    }
  ]
})
export class CommonTextareaComponent implements ControlValueAccessor {
  @Input() label: string = '';
  @Input() required: boolean = false;
  @Input() control!: AbstractControl;
  @Output() inputChanged = new EventEmitter<void>();

  value: string = '';
  onChange = (value: any) => { };
  onTouched = () => { };

  writeValue(value: any): void {
    this.value = value || '';
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  get formControl(): FormControl {
    return this.control as FormControl;
  }

  onInput() {
    this.inputChanged.emit();
  }
}