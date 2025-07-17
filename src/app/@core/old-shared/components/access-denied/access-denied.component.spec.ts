import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccessDeniedComponent } from './access-denied.component';
import { MatIconModule } from '@angular/material/icon';

describe('AccessDeniedComponent', () => {
  let component: AccessDeniedComponent;
  let fixture: ComponentFixture<AccessDeniedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AccessDeniedComponent],
      imports: [MatIconModule],
    }).compileComponents();

    fixture = TestBed.createComponent(AccessDeniedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the accessDeniedMessage with the correct value', () => {
    expect(component.accessDeniedMessage).toBe(
      'Access denied. Authentication required!'
    );
  });

  it('should display the accessDeniedMessage in the template', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('div').textContent).toContain(
      'Access denied. Authentication required!'
    );
  });
});
