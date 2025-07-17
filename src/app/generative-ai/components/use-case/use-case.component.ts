import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GENERATIVE_LOGO_TEXT } from '../../../@core/constants/global.constants';
import { LayoutService } from 'src/app/old-layout/services/layout.service';

@Component({
  selector: 'app-use-case',
  standalone: false,
  templateUrl: './use-case.component.html',
  styleUrl: './use-case.component.css',
})
export class UseCaseComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private layoutService = inject(LayoutService);
  private router = inject(Router);

  project: string = '';
  useCase: string = '';
  isCollapsed: boolean = false;

  ngOnInit(): void {
    this.layoutService.setTitle(GENERATIVE_LOGO_TEXT);
    if (this.route.snapshot) {
      this.useCase = this.route.snapshot.paramMap.get('useCase') ?? '';
      this.project = this.route.snapshot.paramMap.get('project') ?? '';
    }
  }

  backArrowClick(): void {
    this.isCollapsed = !this.isCollapsed;
  }
  nextArrowClick(): void {
    this.isCollapsed = !this.isCollapsed;
  }

  backToDashboard() {
    this.router.navigate(['/dashboard']);
  }
}
