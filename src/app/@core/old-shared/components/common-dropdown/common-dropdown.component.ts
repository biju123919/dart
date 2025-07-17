import {
  Component,
  forwardRef,
  Input,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-common-dropdown',
  standalone: false,
  templateUrl: './common-dropdown.component.html',
  styleUrls: ['./common-dropdown.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CommonDropdownComponent),
      multi: true,
    },
  ],
})
export class CommonDropdownComponent implements ControlValueAccessor, OnInit {
  @Input() options: { value: string; label: string }[] = [];
  @Input() label: string = 'Select';
  isDropdownOpen: boolean = false;
  selectedItem: string = '';
  value: string | null = null;

  onChange: any = () => {};
  onTouched: any = () => {};

  ngOnInit(): void {
  }

  writeValue(value: string): void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {}
}
