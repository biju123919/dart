import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { of } from 'rxjs';
// import { HeaderComponent } from '../../../layout/header/header.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatRadioModule } from '@angular/material/radio';
import { FormsModule } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { Router } from '@angular/router';
import { GenerativeAIService } from '../../services/generative-ai.service';
// import { Project, UseCase, User } from '../../../models/dto/entity.model';
// import { UserManageService } from '../../../core/services/user-manage.service';
// import { AccessDeniedComponent } from '../../../shared/components/access-denied/access-denied.component';
import { MatIconModule } from '@angular/material/icon';

const mockUseCase: UseCase[] = [{ id: 1, projectId: 53, label: 'Ray' }];
const mockProjects: Project[] = [
  {
    id: 53,
    title: 'Assess AI',
    subTitle:
      'Assess-AI combines specific information related to an algorithm’s effectiveness reported by radiologists at the point of care and specific metadata related to the exam.',
  },
];

const mockUser: User = {
  id: '123',
  name: 'Jane Doe',
  email: 'jane.doe@example.com',
};

class MockGenerativeAIService {
  getUseCasesByProjectId = jasmine
    .createSpy('getUseCasesByProjectId')
    .and.returnValue(of(mockUseCase));
  getUserAccessProjects = jasmine
    .createSpy('getUserAccessProjects')
    .and.returnValue(of(mockProjects));
}

class MockUserManageService {
  getUserInfo = jasmine.createSpy('getUserInfo').and.returnValue(of(mockUser));
}

class MockRouter {
  navigate = jasmine.createSpy('navigate').and.returnValue(null);
}

const errorResponse = new Error('Test error');

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let mockGenerativeAIService: GenerativeAIService;
  let mockUserManageService: UserManageService;
  let mockRouter: Router;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    await TestBed.configureTestingModule({
      declarations: [
        DashboardComponent,
        HeaderComponent,
        AccessDeniedComponent,
      ],
      imports: [
        MatExpansionModule,
        MatRadioModule,
        FormsModule,
        MatDividerModule,
        MatIconModule,
      ],
      providers: [
        {
          provide: GenerativeAIService,
          useClass: MockGenerativeAIService,
        },
        {
          provide: UserManageService,
          useClass: MockUserManageService,
        },
        { provide: Router, useClass: MockRouter },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    mockGenerativeAIService = TestBed.inject(GenerativeAIService);
    mockRouter = TestBed.inject(Router);
    component.isViewDataset = true;
    component.expandedPanelIndex = null;
    component.projectId = 53;
    component.selectedUseCase = '1';
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });

  // it('should add index to rotatedIndexes if not present', () => {
  //   // Arrange

  //   // Act
  //   component.toggleRotate(1);

  //   // Assert
  //   expect(component.rotatedIndexes.has(1)).toBeTrue();
  // });

  // it('should remove index from rotatedIndexes if already present', () => {
  //   // Arrange
  //   component.rotatedIndexes.add(2);

  //   // Act
  //   component.toggleRotate(2);

  //   // Assert
  //   expect(component.rotatedIndexes.has(2)).toBeFalse();
  // });

  // it('should toggle index multiple times', () => {
  //   // Arrange

  //   // Act & Assert
  //   component.toggleRotate(3);
  //   expect(component.rotatedIndexes.has(3)).toBeTrue();

  //   // Act & Assert
  //   component.toggleRotate(3);
  //   expect(component.rotatedIndexes.has(3)).toBeFalse();

  //   // Act & Assert
  //   component.toggleRotate(3);
  //   expect(component.rotatedIndexes.has(3)).toBeTrue();
  // });


  // it('should fetch and set cases correctly', () => {
  //   // Arrange
  //   const projectId = 123;

  //   // Act
  //   component.loadUseCases(projectId);

  //   // Assert
  //   expect(mockGenerativeAIService.getUseCasesByProjectId).toHaveBeenCalledWith(53);
  //   expect(component.useCases).toEqual(mockUseCase);
  // });

  // it('should set projectId and expand panel when none expanded', () => {
  //   // Arrange

  //   // Act
  //   component.togglePanel(53, 0);

  //   // Assert
  //   expect(component.projectId).toBe(53);
  //   expect(component.expandedPanelIndex).toBeNull();
  // });


  // it('should collapse panel if clicked again (toggle off)', () => {
  //   // Arrange
  //   component.expandedPanelIndex = 1;

  //   // Act
  //   component.togglePanel(53, 1);

  //   // Assert
  //   expect(component.projectId).toBe(53);
  //   expect(component.expandedPanelIndex).toBe(1);
  // });

  // it('should expand new panel when different index clicked', () => {
  //   // Arrange
  //   component.expandedPanelIndex = 3;

  //   // Act
  //   component.togglePanel(53, 3);

  //   // Assert
  //   expect(component.projectId).toBe(53);
  //   expect(component.expandedPanelIndex).toBe(3);
  // });

  // it('should update isViewDataset, selectedUseCaseByProject, and set localStorage', () => {
  //   // Arrange
  //   const projectId = '123';
  //   const useCaseValue = 'analytics';

  //   // Act
  //   component.onUseCaseChange(projectId, useCaseValue);

  //   // Assert
  //   expect(component.isViewDataset).toBeFalse();
  //   expect(component.selectedUseCaseByProject[projectId]).toBe(useCaseValue);
  //   expect(localStorage.getItem('useCaseId')).toBe(useCaseValue);
  // });

  // it('should not navigate if use case label is not found', () => {
  //   // Arrange
  //   component.useCasesByProject = { '1': [] };
  //   const projectId = 123;

  //   // Act
  //   component.loadUseCases(projectId);
  //   component.goToDataset('1');

  //   // Assert
  //   expect(mockGenerativeAIService.getUseCasesByProjectId).toHaveBeenCalledWith(53);
  //   expect(mockRouter.navigate).not.toHaveBeenCalled();
  // });
});
