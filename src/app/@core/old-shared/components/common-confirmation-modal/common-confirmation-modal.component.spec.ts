import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonConfirmationModalComponent } from './common-confirmation-modal.component';

describe('CommonConfirmationModalComponent', () => {
  let component: CommonConfirmationModalComponent;
  let fixture: ComponentFixture<CommonConfirmationModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CommonConfirmationModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommonConfirmationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
