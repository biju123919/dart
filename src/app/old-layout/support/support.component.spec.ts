import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupportComponent } from './support.component';
import { SUPPORT_EMAIL } from '../../constants/global.constants';

describe('SupportComponent', () => {
  let component: SupportComponent;
  let fixture: ComponentFixture<SupportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SupportComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SupportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default supportEmail value', () => {
    // Arrange & Assert
    const supportEmail = SUPPORT_EMAIL;
    expect(component.supportEmail).toBe(supportEmail);
  });
});
