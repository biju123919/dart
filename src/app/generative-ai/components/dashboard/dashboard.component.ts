import { Component, inject, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { GenerativeAIService } from '../../services/generative-ai.service';
import { GENERATIVE_LOGO_TEXT, GENERATIVE_AI_TITLE, GENERATIVE_AI_SUBTITLE } from '../../../@core/constants/global.constants';
import { ProjectUseCaseDetails } from '../../../@core/model/dto/entity.model';
import { LayoutService } from 'src/app/old-layout/services/layout.service';
import { SessionStateService } from 'src/app/@core/state-management/session-state.service';
import { SvgIcon } from 'src/app/@core/enums/svg-icon';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrl: './dashboard.component.css',
})

export class DashboardComponent implements OnInit {
  private generativeAIService = inject(GenerativeAIService);
  private router = inject(Router);
  private layoutService = inject(LayoutService);
  private sessionStateService = inject(SessionStateService);

  title: string = GENERATIVE_AI_TITLE;
  subTitle: string = GENERATIVE_AI_SUBTITLE;

  projectName: string = 'Assess-AI';

  userId: string = '';
  isAccessDenied: boolean = false;
  projectsWithUseCases: ProjectUseCaseDetails[] = [];
  selectedUseCaseByProject: { [projectId: string]: string | number } = {};
  svgIcon = SvgIcon;
  loading: boolean = false;
  openIndex: number | null = null;
  hoveredIndex: number | null = null;

  ngOnInit(): void {
    this.userId = this.sessionStateService?.userDetails?.externalId;
    this.layoutService.setTitle(GENERATIVE_LOGO_TEXT);
    this.loadProjectUseCases();
  }

  loadProjectUseCases(): void {
    this.loading = true;
    this.generativeAIService.getProjectsWithUseCases(this.userId).subscribe({
      next: (projects: ProjectUseCaseDetails[]) => {
        this.loading = false;
        const filteredProjects = projects.filter(project =>
          project.externalId.toLowerCase().includes('assess')
        );
        this.projectsWithUseCases = filteredProjects;
        console.log('Filtered Projects:', filteredProjects);
        console.log(this.projectsWithUseCases);
      },
      error: (err: unknown) => {
        this.loading = false;
        console.error('Error:', err);
      }
    });
  }

  onViewDatasets(project: any) {
    const projectName = project.name;
    const projectId = project.id;
    const selectedUseCaseId = this.selectedUseCaseByProject[projectId];

    const selectedUseCase = project.useCaseDetails.find(
      (uc: any) => uc.id == selectedUseCaseId
    );
    const selectedUseCaseLabel = selectedUseCase.label;

    localStorage.setItem('useCaseId', String(selectedUseCaseId));
    // this.sharedService.setValue('useCaseId', selectedUseCaseId);
    // console.log(this.sharedService.getValue('useCaseId'));
    this.router.navigate(['/usecase', projectName, selectedUseCaseLabel]);
  }
}
