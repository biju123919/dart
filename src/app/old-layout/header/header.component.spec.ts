import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderComponent } from './header.component';
import { of } from 'rxjs';
import { LayoutService } from '../services/layout.service';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { UserManageService } from '../../@core/service/user-manage.service';
import { AuthenticationService } from '../../@core/service/authentication.service';

const mockLayoutService = {
  setUserEmail: jasmine.createSpy('setUserEmail'),
  title$: of('Test Title'),
  userEmail$: of('test@example.com'),
};

const mockUserManageService = {
  getUserInfo: jasmine.createSpy('getUserInfo').and.returnValue({ email: 'test@example.com' }),
};

const mockAuthService = {
  oktaLogOut: jasmine.createSpy('oktaLogOut'),
};

const mockRouter = {
  navigate: jasmine.createSpy('navigate'),
  url: '/dashboard'
};

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HeaderComponent],
      imports: [MatIconModule],
      providers: [
        { provide: LayoutService, useValue: mockLayoutService },
        { provide: UserManageService, useValue: mockUserManageService },
        { provide: AuthenticationService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
      ],
    })
      .compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call setUserEmail with empty string when URL is "/"', () => {
    // Arrange
    mockRouter.url = '/';

    // Act
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    // Assert
    expect(mockLayoutService.setUserEmail).toHaveBeenCalledWith('');
  });

  it('should call setUserEmail with user email and handle userEmail$ subscription', () => {
    // Arrange
    mockRouter.url = '/dashboard';
    mockLayoutService.userEmail$ = of('test@example.com');

    // Act
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    // Arrange
    expect(mockLayoutService.setUserEmail).toHaveBeenCalledWith('test@example.com');
    expect(component.userEmail).toBe('test@example.com');
    expect(component.isLogOut).toBeTrue();
  });

  it('should set userEmail and subscribe to observables in ngOnInit', () => {
    // Arrange, Act & Assert
    expect(mockUserManageService.getUserInfo).toHaveBeenCalled();
    expect(component.userEmail).toBe('test@example.com');
    expect(mockLayoutService.setUserEmail).toHaveBeenCalledWith('test@example.com');
    expect(component.title).toBe('Test Title');
    expect(component.isLogOut).toBeTrue();
  });

  it('should call logout and navigate on onLogOutClick', () => {
    // Arrange
    spyOn(localStorage, 'setItem');

    // Act
    component.onLogOutClick();

    // Assert
    expect(localStorage.setItem).toHaveBeenCalledWith('logoutEvent', 'true');
    expect(mockAuthService.oktaLogOut).toHaveBeenCalled();
  });

  it('should toggle showMyContainer on toggleExpand', () => {
    // Arrange
    component.showMyContainer = false;

    // Act & Assert
    component.toggleExpand();
    expect(component.showMyContainer).toBeTrue();

    component.toggleExpand();
    expect(component.showMyContainer).toBeFalse();
  });

  it('should toggle showLogout on toggleLogoutMenu', () => {
    // Arrange
    component.showLogout = false;
    component.toggleLogoutMenu();
    expect(component.showLogout).toBeTrue();

    component.toggleLogoutMenu();
    expect(component.showLogout).toBeFalse();
  });

  it('should hide logout menu if clicked outside logout container', () => {
    // Arrange
    const mockElement = document.createElement('div');
    component.logoutContainer = {
      nativeElement: {
        contains: () => false
      }
    } as any;

    // Act
    component.showLogout = true;
    component.onClickOutside(mockElement);

    // Assert
    expect(component.showLogout).toBeFalse();
  });

  it('should NOT hide logout menu if clicked inside logout container', () => {
    // Arrange
    const mockElement = document.createElement('div');
    component.logoutContainer = {
      nativeElement: {
        contains: () => true
      }
    } as any;

    // Act
    component.showLogout = true;
    component.onClickOutside(mockElement);

    // Assert
    expect(component.showLogout).toBeTrue();
  });

});
