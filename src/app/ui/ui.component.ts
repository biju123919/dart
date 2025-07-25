import { Component } from '@angular/core';
import { AuthenticationService } from '../@core/service/authentication.service';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter, map } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: false,
  templateUrl: './ui.component.html'
})
export class UiComponent {

  title = 'acrdart-frontend';
  headerTitle: string = '';

  constructor(private authentication: AuthenticationService, private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.authentication.initializeCoreService();
    this.listenToLogoutEvents()
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => {
        let route = this.activatedRoute.firstChild;
        while (route?.firstChild) {
          route = route.firstChild;
        }
        return route?.snapshot.data['title'] || 'Default Title';
      })
    )
      .subscribe(title => (this.headerTitle = title));
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
