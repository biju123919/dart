import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonTextareaComponent } from './common-textarea.component';

describe('CommonTextareaComponent', () => {
  let component: CommonTextareaComponent;
  let fixture: ComponentFixture<CommonTextareaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CommonTextareaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommonTextareaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
