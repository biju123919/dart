import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reports',
  standalone: true,
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.css',
})
export class ReportsComponent {
  private router = inject(Router);

  handleNavigation() {
    this.router.navigate(['/home'])
  }
} 