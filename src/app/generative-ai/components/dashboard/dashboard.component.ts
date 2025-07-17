import { Component, inject, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { GenerativeAIService } from '../../services/generative-ai.service';
import { GENERATIVE_LOGO_TEXT, GENERATIVE_AI_TITLE, GENERATIVE_AI_SUBTITLE } from '../../../@core/constants/global.constants';
import { UserManageService } from '../../../@core/service/user-manage.service';
import { Project, UseCase } from '../../../@core/model/dto/entity.model';
import { LayoutService } from 'src/app/old-layout/services/layout.service';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  private generativeAIService = inject(GenerativeAIService);
  private userService = inject(UserManageService);
  private router = inject(Router);
  private layoutService = inject(LayoutService);

  title: string = GENERATIVE_AI_TITLE;
  subTitle: string = GENERATIVE_AI_SUBTITLE;
  isViewDataset: boolean = true;
  userAccessProjects: Project[] = [];
  useCases: UseCase[] = [];
  selectedUseCase: string | null = null;
  userEmail: string = '';
  expandedPanelIndex: number | null = 0;
  projectName: string = 'Assess-AI';
  projectId?: number;
  userId: string = '';
  isAccessDenied: boolean = false;

  useCasesByProject: { [projectId: string]: UseCase[] } = {};
  selectedUseCaseByProject: { [projectId: string]: UseCase | null } = {};
  loadUseCasesByProject: { [projectId: string]: boolean } = {};

  ngOnInit(): void {
    const data = this.userService.getUserInfo();
    this.userEmail = data?.email ?? '';
    this.userId = data?.id ?? '';
    localStorage.setItem('userId', this.userId);
    this.layoutService.setUserEmail(this.userEmail);
    this.layoutService.setTitle(GENERATIVE_LOGO_TEXT);
    this.loadProjects();
  }

  loadProjects(): void {
    this.generativeAIService.getUserAccessProjects(this.userId).subscribe({
      next: (response: Project[]) => {
        this.userAccessProjects = (response ?? []).filter((project) =>
          project.externalId.includes('Assess')
        );

        if (this.userAccessProjects.length > 0) {
          this.loadUseCases(this.userAccessProjects[0].id);
        }
      },
      error: (err) => {
        console.error('Failed to load user projects:', err);
      },
    });
  }

  loadUseCases(projectId: any): void {
    for (const projId in this.selectedUseCaseByProject) {
      if (Number(projId) !== projectId) {
        this.selectedUseCaseByProject[projectId] = null;
      }
    }
    if (this.useCasesByProject[projectId] || this.loadUseCasesByProject[projectId]) return;

    this.loadUseCasesByProject[projectId] = true;

    this.generativeAIService.getUseCasesByProjectId(projectId).subscribe({
      next: (response: UseCase[]) => {
        this.useCasesByProject[projectId] = response;
        this.loadUseCasesByProject[projectId] = false;
      },
      error: (err) => {
        console.error('Failed to load use cases:', err);
      }
    });
  }

  getSelectedUseCaseLabel(projectId: any): string | null {
    const selectedId = this.selectedUseCaseByProject[projectId];
    const useCases = this.useCasesByProject[projectId];
    const selectedUseCase = useCases?.find(useCase => useCase.id === String(selectedId));
    return selectedUseCase?.label || null;
  }

  goToDataset(value: any, useCase: any): void {
    this.loadUseCases(value);
    const project = this.userAccessProjects.find(
      (p) => p.id == value
    )?.name;
    if (useCase) {
      this.router.navigate(['/usecase', project, useCase]);
    } else {
    }
  }
}
