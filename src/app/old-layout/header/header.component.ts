import {
  Component,
  ElementRef,
  HostListener,
  inject,
  Input,
  OnInit,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { LayoutService } from '../services/layout.service';
import { Router } from '@angular/router';
import { take, Subscription } from 'rxjs';
import { UserManageService } from '../../@core/service/user-manage.service';
import { AuthenticationService } from '../../@core/service/authentication.service';
import { SvgIcon } from '../../@core/enums/svg-icon';
import { MenuItem } from 'src/app/@core/model/menu-item';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit, OnDestroy {
  private authentication = inject(AuthenticationService);
  private userManageService = inject(UserManageService);
  private layoutService = inject(LayoutService);
  private router = inject(Router);
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

  private subscriptions: Subscription[] = [];

  ngOnInit(): void {
    this.loadUserData();
    this.setupLayoutSubscriptions();
    this.setupAuthenticationSubscription();
    
    // Listen for localStorage changes (for cross-tab updates)
    this.setupStorageListener();
  }

  ngOnDestroy(): void {
    // Clean up all subscriptions
    this.subscriptions.forEach(sub => sub.unsubscribe());
    // Clean up the event listener
    window.removeEventListener('storage', this.handleStorageChange);
  }

  private loadUserData(): void {
    const data = this.userManageService.getUserInfo();
    this.userEmail = data?.email ?? '';
    
    const user = localStorage.getItem('userInfo');
    if (user) {
      const parsedUser = JSON.parse(user);
      this.userName = parsedUser?.name ?? '';
    }
    
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

  menuItems: MenuItem[] = [
    { label: 'Welcome', route: '/' },
    { label: 'Reports', route: '/reports' },
    { label: 'Settings', route: '/settings'}
  ];

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
  }

  login() {
    this.authentication?.initializeLoginFlow()
  }

  // Method to manually refresh data when localStorage changes
  refreshUserData(): void {
    this.loadUserData();
  }

 onMenuClick(item: MenuItem): void {
  this.router.navigate([item.route]);
  this.isSidebarOpen = !this.isSidebarOpen;
 }
}