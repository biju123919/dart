import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-projects',
  standalone: false,
  templateUrl: './projects.component.html'
})
export class ProjectsComponent {
requestAccess() {
throw new Error('Method not implemented.');
}
private router = inject(Router);

  handleNavigation() {
    this.router.navigate(['/home'])
  }
}
