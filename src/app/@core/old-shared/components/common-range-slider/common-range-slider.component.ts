import { Component, forwardRef, Input, ViewEncapsulation } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-common-range-slider',
  standalone: false,
  templateUrl: './common-range-slider.component.html',
  styleUrls: ['./common-range-slider.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CommonRangeSliderComponent),
      multi: true
    }
  ],
  encapsulation: ViewEncapsulation.None
})
export class CommonRangeSliderComponent implements ControlValueAccessor {
  @Input() min: number = 0;
  @Input() max: number = 100;
  @Input() step: number = 1;

  valueStart: number = 0;
  valueEnd: number = 0;

  private onChange: any = () => { };
  private onTouched: any = () => { };

  writeValue(value: [number, number]): void {
    if (value) {
      [this.valueStart, this.valueEnd] = value;
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  ngOnInit() {
  }

  onValueChange() {
    this.onChange([this.valueStart, this.valueEnd]);
    this.onTouched();
  }
}