import { Component, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AuthenticationService } from '../../service/authentication.service';
import { UserManageService } from '../../service/user-manage.service';

@Component({
  selector: 'app-okta-access',
  standalone: false,
  templateUrl: './okta-access.component.html'
})
export class OktaAccessComponent {
loading: boolean = false;
  user: any = {};
  destroy$: Subject<boolean> = new Subject<boolean>();
  siteList: Subject<any> = new Subject<any>();

  constructor(
    private authenication: AuthenticationService,
    private router: Router,
    private userManagementService: UserManageService
  ) {}

  ngOnInit(): void {
    this.subscribeToTokenState();
  }

  async subscribeToTokenState() {
    let idToken;
    let accessToken;
    this.authenication
      .getLoginStatus()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (value) => {
          if (value) {
            idToken = this.authenication.getOktaIdToken();
            accessToken = this.authenication.getOktaAccessToken();
            this.loadApp(idToken, accessToken);
          }
        },
        error: (error) => {},
      });
  }

  async loadApp(idToken: string | null, accessToken: string | null) {
    this.showLoaderComponent();
    if (idToken && accessToken) {
      const userName = this.authenication.getDecodedAccessToken(idToken).name;
      const userEmail =
        this.authenication.getDecodedAccessToken(idToken).preferred_username;
      const userId = this.authenication.getDecodedAccessToken(idToken).sub;
      this.user.name = userName;
      this.user.email = userEmail;
      this.user.id = userId;
      this.user.oktaId =
        this.authenication.getDecodedAccessToken(accessToken).uid;
      const isEmailMatch = this.userManagementService.checkEmail(userEmail);
      this.userManagementService.setUserInfo(this.user, isEmailMatch);

      this.hideLoaderComponent();
      if (isEmailMatch) {
        this.router.navigate(['/dashboard']);
      } else {
        this.router.navigate(['/dashboard']);
      }
    } else {
      this.authenication.oktaLogOut();
    }
    return;
  }

  private showLoaderComponent() {
    this.loading = true;
  }

  private hideLoaderComponent() {
    this.loading = false;
  }
}
