import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WelcomeComponent } from './welcome.component';
import { Component, ElementRef } from '@angular/core';
import { AuthenticationService } from '../../core/authentication/services/authentication.service';

@Component({
  selector: 'app-support',
  standalone: false,
  template: '',
})
class MockSupportComponent { }

@Component({
  selector: 'app-footer',
  standalone: false,
  template: '',
})
class MockFooterComponent { }

describe('WelcomeComponent', () => {
  let component: WelcomeComponent;
  let fixture: ComponentFixture<WelcomeComponent>;

  let mockAuthService: jasmine.SpyObj<AuthenticationService>;
  let querySelectorSpy: jasmine.Spy;

  beforeEach(() => {
    querySelectorSpy = jasmine.createSpy('querySelector').and.returnValue(null);

    const mockElementRef = {
      nativeElement: {
        querySelector: querySelectorSpy,
      },
    } as ElementRef;

    mockAuthService = jasmine.createSpyObj('AuthenticationService', [
      'initializeLoginFlow',
    ]);

    TestBed.configureTestingModule({
      declarations: [
        WelcomeComponent,
        MockSupportComponent,
        MockFooterComponent,
      ],
      providers: [
        { provide: ElementRef, useValue: mockElementRef },
        { provide: AuthenticationService, useValue: mockAuthService },
      ],
    });

    fixture = TestBed.createComponent(WelcomeComponent);
    component = fixture.componentInstance;
  });
  it('should call initializeLoginFlow on AuthenticationService', () => {
    // Act
    component.onLoginClick();

    // Assert
    expect(mockAuthService.initializeLoginFlow).toHaveBeenCalled();
  });
});
