import { Component, ElementRef, HostListener, Input, ViewChild } from '@angular/core';
import { SessionStateService } from '../../state-management/session-state.service';
import { AuthenticationService } from '../../service/authentication.service';
import { UserManageService } from '../../service/user-manage.service';
import { LayoutService } from 'src/app/old-layout/services/layout.service';
import { Router } from '@angular/router';
import { SvgIcon } from '../../enums/svg-icon';
import { Subscription, take } from 'rxjs';
import { BREAKPOINTS } from '../../constants/constants';

interface ProfileAction {
  key: string;
  label: string;
  route?: string;
  action?: () => void;
  condition?: () => boolean;
}

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.component.html'
})
export class HeaderComponent {
  constructor(private sessionStateService: SessionStateService, private authentication: AuthenticationService, private userManageService: UserManageService,
    private layoutService: LayoutService, private router: Router) { }
  @ViewChild('dropdownRef') dropdownRef!: ElementRef;
  hover: boolean = false;
  svgIcon = SvgIcon;
  isSidebarOpen: boolean = false
  accessToken: any;
  userName: any
  @Input() title = '';
  showLogout: boolean = false;
  isLogOut: boolean = false;
  showMyContainer: boolean = false;
  @ViewChild('logoutContainer') logoutContainer!: ElementRef;
  @Input() userEmail: any = null;
  showProfileMenu: boolean = false
  screenWidth!: number;
  showdata: boolean = true;
  showAuthButtons: boolean = true;

  private readonly profileActions: ProfileAction[] = [
    {
      key: 'new_data_request',
      label: 'New Data Request',
      route: '/NewDataRequest',
    },
    {
      key: 'my_requests',
      label: 'My Requests',
      route: '/myRequests',
    },
    {
      key: 'account',
      label: 'Account',
      route: '/account',
    },
    {
      key: 'sign_out',
      label: 'Sign Out',
      action: () => this.onLogout()
    }
  ];

  private subscriptions: Subscription[] = [];

  ngOnInit(): void {
    this.loadUserData();
    this.setupLayoutSubscriptions();
    this.setupAuthenticationSubscription();
    this.initializeResponsiveLayout();

    this.setupStorageListener();
    this.authentication?._isMenuVisible$.subscribe((data: any) => {
      this.isSidebarOpen = data
    })
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    window.removeEventListener('storage', this.handleStorageChange);
  }

  private loadUserData(): void {
    const data = this.userManageService.getUserInfo();
    this.userEmail = data?.email ?? '';
    // Use the authentication service to get the access token
    this.accessToken = this.authentication.getOktaAccessToken();
  }

  private setupLayoutSubscriptions(): void {
    const currentUrl = this.router.url;

    if (currentUrl === '/') {
      this.layoutService.setUserEmail('');
    } else {
      this.layoutService.setUserEmail(this.userEmail);
      this.layoutService.userEmail$.pipe(take(1)).subscribe(email => {
      });
    }

    const titleSub = this.layoutService.title$.subscribe((t) => (this.title = t));
    this.subscriptions.push(titleSub);

    const emailSub = this.layoutService.userEmail$.subscribe((email) => {
      this.userEmail = email;
      this.isLogOut = this.userEmail ? true : false;
    });
    this.subscriptions.push(emailSub);
  }

  private setupAuthenticationSubscription(): void {
    // Subscribe to login status changes
    const loginStatusSub = this.authentication.getLoginStatus().subscribe(isLoggedIn => {
      if (isLoggedIn) {
        this.loadUserData();
      } else {
        // Clear user data when logged out
        this.accessToken = null;
        this.userName = '';
        this.userEmail = '';
      }
    });
    this.subscriptions.push(loginStatusSub);

    // If you implement getUserInfo$() in AuthenticationService, uncomment this:
    // const userInfoSub = this.authentication.getUserInfo$().subscribe(userInfo => {
    //   if (userInfo) {
    //     this.userName = userInfo.name || '';
    //     this.userEmail = userInfo.email || '';
    //     this.accessToken = this.authentication.getOktaAccessToken();
    //   } else {
    //     this.userName = '';
    //     this.userEmail = '';
    //     this.accessToken = null;
    //   }
    // });
    // this.subscriptions.push(userInfoSub);
  }

  private setupStorageListener(): void {
    // Listen for storage events (works for changes from other tabs/windows)
    window.addEventListener('storage', this.handleStorageChange.bind(this));
  }

  private handleStorageChange = (event: StorageEvent): void => {
    if (event.key === 'access_token' || event.key === 'userInfo') {
      this.loadUserData();
    }
  }

  sideMenus = ['Welcome', 'All Projects']

  onLogOutClick() {
    localStorage.setItem('logoutEvent', 'true');
    this.authentication.oktaLogOut();
  }

  toggleExpand() {
    this.showMyContainer = !this.showMyContainer;
  }

  toggleLogoutMenu() {
    this.showLogout = !this.showLogout;
  }

  @HostListener('document:click', ['$event.target'])
  public onClickOutside(targetElement: HTMLElement): void {
    if (
      this.logoutContainer &&
      !this.logoutContainer.nativeElement.contains(targetElement)
    ) {
      this.showLogout = false;
    }
  }

  toggleBurger() {
    this.isSidebarOpen = !this.isSidebarOpen
    this.authentication?.showMenu(this.isSidebarOpen)
  }

  login() {
    this.authentication?.initializeLoginFlow()
  }

  // Method to manually refresh data when localStorage changes
  refreshUserData(): void {
    this.loadUserData();
  }

  profileDropdown() {
    this.showProfileMenu = !this.showProfileMenu
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    const target = event.target as HTMLElement;

    if (this.showProfileMenu) {
      const clickedInside = this.dropdownRef?.nativeElement.contains(target);
      if (!clickedInside) {
        this.showProfileMenu = false;
      }
    }
  }
  get visibleProfileActions(): ProfileAction[] {
    return this.profileActions.filter(action =>
      !action.condition || action.condition()
    );
  }
  onLogout() {
    this.authentication.oktaLogOut();
  }

  profileAction(actionKey: string) {
    const action = this.profileActions.find(a => a.key === actionKey);

    if (!action) {
      console.warn(`Unknown profile action: ${actionKey}`);
      return;
    }

    document.body.style.overflow = '';

    if (action.action) {
      action.action();
    } else if (action.route) {
      this.router.navigate([action.route]);
    }
  }

  private initializeResponsiveLayout(): void {
    this.screenWidth = window.innerWidth;
    this.updateLayoutForScreenSize();
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.screenWidth = window.innerWidth;
    this.updateLayoutForScreenSize();
  }

  navigateToHome() {
    if (this.isLoggedinUser()) {
      this.router?.navigate(['/home']);
    } else {
      this.router?.navigate(['']);
    }
  }

  private updateLayoutForScreenSize(): void {
    this.showAuthButtons = this.screenWidth > BREAKPOINTS.AUTH;
    this.showdata = this.screenWidth > BREAKPOINTS.DATA;
  }

  loggedInUserName() {
    return this.sessionStateService?.userDetails?.name;
  }

  isLoggedinUser() {
    return this.sessionStateService.isUserLoggedIn;
  }

}
