import { Component } from '@angular/core';
import { AuthenticationService } from '../@core/service/authentication.service';

@Component({
  selector: 'app-root',
  standalone: false,
  templateUrl: './ui.component.html'
})
export class UiComponent {

    title = 'acrdart-frontend';
    headerTitle: string = '';
  
    constructor(private authentication: AuthenticationService) { }
  
    ngOnInit(): void {
      this.authentication.initializeCoreService();
      this.listenToLogoutEvents()
    }
  
    listenToLogoutEvents() {
      window.addEventListener('storage', (event) => {
        if (event.key === 'logoutEvent') {
          localStorage.removeItem('logoutEvent');
          this.authentication.oktaLogOut();
        }
      });
    }
}
