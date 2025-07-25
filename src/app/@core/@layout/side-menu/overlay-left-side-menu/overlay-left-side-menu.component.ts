import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { SvgIcon } from 'src/app/@core/enums/svg-icon';
import { AuthenticationService } from 'src/app/@core/service/authentication.service';
import { SessionStateService } from 'src/app/@core/state-management/session-state.service';


interface NavigationItem {
  key: string;
  label: string;
  route?: string;
  exactMatch?: boolean;
  action?: () => void;
  urlPatterns?: string[];
  children?: NavigationItem[];
  condition?: () => boolean;
}

interface ProfileAction {
  key: string;
  label: string;
  route?: string;
  action?: () => void;
  condition?: () => boolean;
}

@Component({
  selector: 'overlay-left-side-menu',
  standalone: false,
  templateUrl: './overlay-left-side-menu.component.html'
})
export class OverlayLeftSideMenuComponent {
  showSideMenu: any;
  constructor(private sessionStorageService: SessionStateService, private authentication: AuthenticationService, private router: Router) { }
  screenWidth!: number;
  showSignIn: boolean = false
  showUserName: boolean = false

  svgIcon = SvgIcon;
  private readonly navigationItems: NavigationItem[] = [
    {
      key: 'home',
      label: 'Home',
      route: '/home',
      exactMatch: true,
      action: () => this.navigateToHome()
    },
    {
      key: 'all-projects',
      label: 'All Projects',
      route: '/projects',
    },
    {
      key: 'signUp',
      label: 'SignUp',
      condition: () => this.showSignIn,
    },
    {
      key: 'logInWithAcrId',
      label: 'LOG IN with ACR ID',
      condition: () => this.showSignIn,
      action: () => this.login(),
    },
    {
      key: 'explore-data',
      label: 'Explore Data',
      route: '/explore-data',
      urlPatterns: ['/explore-data'],
      condition: () => this.isLoggedinUser()
    },
    {
      key: 'reports',
      label: 'Reports',
      route: '/reports',
      urlPatterns: ['/reports'],
      condition: () => this.isLoggedinUser()
    },
    {
      key: 'generative-aI',
      label: 'Generative AI',
      route: '/dashboard',
      urlPatterns: ['/generativeAI'],
      condition: () => this.isLoggedinUser(),
    },
    {
      key: 'workspace',
      label: 'My Workspace',
      route: '/workspace/dataset',
      urlPatterns: ['/workspace'],
      children: [
      { key: 'dataset', label: 'Dataset', route: '/workspace/dataset' },
      { key: 'registry-data-search', label: 'Registry Data Search', route: '/workspace/registry-search' }
    ],
      condition: () => this.isLoggedinUser()
    }
  ];

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

  isLoggedinUser() {
    return this.sessionStorageService?.isUserLoggedIn
  }

  ngOnInit() {
    this.initializeResponsiveLayout()
    this.authentication?._isMenuVisible$.subscribe((data: any) => {
      this.showSideMenu = data
    })
  }

  get visibleMenuActions(): NavigationItem[] {
    return this.navigationItems.filter(action =>
      !action.condition || action.condition()
    );
  }

  get visibleProfileActions(): ProfileAction[] {
    return this.profileActions.filter(action =>
      !action.condition || action.condition()
    );
  }
  login() {
    this.authentication?.initializeLoginFlow()
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

  private updateLayoutForScreenSize(): void {
    if (this.screenWidth < 1000) {
      this.showUserName = true;
    } else {
      this.showUserName = false;
    }
  }

  loggedInUserName() {
    return this.sessionStorageService?.userDetails?.name;
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
  menuAction(actionKey: string) {
    const action = this.navigationItems.find(a => a.key === actionKey);

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


  closeSideMenu() {
    this.authentication?.showMenu(false)
  }

  navigateToHome() {
    if (this.isLoggedinUser()) {
      this.router?.navigate(['/home']);
    } else {
      this.router?.navigate(['']);
    }
  }
}
