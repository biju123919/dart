import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonRangeSliderComponent } from './common-range-slider.component';

describe('CommonRangeSliderComponent', () => {
  let component: CommonRangeSliderComponent;
  let fixture: ComponentFixture<CommonRangeSliderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CommonRangeSliderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommonRangeSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
