import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reports',
  standalone: true,
  templateUrl: './reports.component.html'
})
export class ReportsComponent {
  private router = inject(Router);

  handleNavigation() {
    this.router.navigate(['/home'])
  }
} 