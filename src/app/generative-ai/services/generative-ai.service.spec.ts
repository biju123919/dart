import { TestBed } from '@angular/core/testing';
import { GenerativeAIService } from './generative-ai.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import {
  ComputeConcordance,
  Model,
  Project,
  Prompt,
  UseCase,
} from '../../models/dto/entity.model';
import {
  ComputeConcordanceDTO,
  ModelDTO,
  ProjectDTO,
  PromptDTO,
  UseCaseDTO,
} from '../../models/dto/entity.dto';
import {
  mapComputeConcordanceEntityDtoToModel,
  mapModelEntityDtoToModel,
  mapProjectEntityDtoToModel,
  mapPromptEntityDtoToModel,
  mapUseCaseEntityDtoToModel,
} from '../../mapper/entity.mapper';
import { ApiEndpoints } from '../../constants/api-endpoints';
import { AppConfigService } from '../../core/services/app.config.service';
import {
  DeletePromptPayload,
  SavePromptPayload,
  UpdatePromptPayload,
} from '../../models/dto/payload.dto';

const mockResponse = {
  data: [
    { id: 1, use_case_name: 'Use Case 1' },
    { id: 2, use_case_name: 'Use Case 2' },
  ],
};

const expectedUseCases: UseCase[] = [
  {
    id: 1,
    label: 'Use Case 1',
    projectId: '564',
  },
  {
    id: 2,
    label: 'Use Case 2',
    projectId: '564',
  },
];

const mockProjectDTO: ProjectDTO = {
  id: '1',
  description: 'Assess-AI',
  externalId: '',
  name: '',
};
const mappedProject: Project = mapProjectEntityDtoToModel(mockProjectDTO);

const mockUseCaseDto: UseCaseDTO = {
  id: 1,
  projectId: 123,
  useCaseName: '',
  recordCount: '',
  s3Path: '',
};
const mappedUseCase: UseCase = mapUseCaseEntityDtoToModel(mockUseCaseDto);

const mockComputeConcordanceDto: ComputeConcordanceDTO = {
  id: 1,
  name: 'Certainity',
};
const mappedComputeConcordance: ComputeConcordance =
  mapComputeConcordanceEntityDtoToModel(mockComputeConcordanceDto);

const mockModelDto: ModelDTO = {
  id: 1,
  name: 'Test Model',
};
const mappedModel: Model = mapModelEntityDtoToModel(mockModelDto);

const mockUpdatePromptPayload: UpdatePromptPayload = {
  id: '1',
  promptName: '',
  promptText: '',
  useCaseId: '',
  userId: '123',
};

const mockDeletePromptPayload: DeletePromptPayload = {
  id: '1',
  userId: '123',
};

const mockSavePromptPayload: SavePromptPayload = {
  promptName: 'Test prompt',
  promptText: '',
  useCaseId: '9',
  userId: '123',
};

const mockPromptDto: PromptDTO = {
  id: 1,
  promptName: '',
  promptText: 'Test Prompt',
  useCaseId: '9',
  userId: '123',
};
const mappedPrompt: Prompt = mapPromptEntityDtoToModel(mockPromptDto);

class MockAppConfigService {
  environment = {
    api: {
      AIUrl: 'https://fake-api.com',
    },
  };
}

describe('GenerativeAIService', () => {
  let service: GenerativeAIService;
  let httpMock: HttpTestingController;
  let mockAppConfigService: AppConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        GenerativeAIService,
        { provide: AppConfigService, useClass: MockAppConfigService },
      ],
    });
    service = TestBed.inject(GenerativeAIService);
    httpMock = TestBed.inject(HttpTestingController);
    service.generativeAIApiUrl = 'https://fake-api.com';
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call GET with correct URL and return mapped projects', () => {
    // Arrange
    const userId = '123';
    const expectedUrl = `${service.generativeAIApiUrl
      }/${ApiEndpoints.userAccessProjects(userId)}`;

    //Act
    service.getUserAccessProjects(userId).subscribe((projects) => {
      expect(projects.length).toBe(1);
      expect(projects[0]).toEqual(mappedProject);
    });

    // Assert
    const req = httpMock.expectOne(expectedUrl);

    expect(req.request.method).toBe('GET');

    req.flush({ data: [mockProjectDTO] });
  });

  it('should fetch use cases by project ID and map the response to UseCase[]', () => {
    // Arrange
    const projectId = 123;
    const expectedUrl = `${service.generativeAIApiUrl
      }/${ApiEndpoints.useCaseByProjectId(projectId)}`;

    //Act
    service.getUseCasesByProjectId(projectId).subscribe((cases) => {
      expect(cases.length).toBe(1);
      expect(cases[0]).toEqual(mappedUseCase);
    });

    // Assert
    const req = httpMock.expectOne(expectedUrl);
    expect(req.request.method).toBe('GET');

    req.flush({ data: [mockUseCaseDto] });
  });

  it('should fetch compute concordance and map the response to ComputeConcordance[]', () => {
    // Arrange
    const expectedUrl = `${service.generativeAIApiUrl}/${ApiEndpoints.computeConcordance}`;

    //Act
    service.getComputeConcordances().subscribe((objective) => {
      expect(objective.length).toBe(1);
      expect(objective[0]).toEqual(mappedComputeConcordance);
    });

    // Assert
    const req = httpMock.expectOne(expectedUrl);
    expect(req.request.method).toBe('GET');

    req.flush({ data: [mockComputeConcordanceDto] });
  });

  it('should fetch model and map the response to Model[]', () => {
    // Arrange
    const expectedUrl = `${service.generativeAIApiUrl}/${ApiEndpoints.model}`;

    //Act
    service.getModels().subscribe((model) => {
      expect(model.length).toBe(1);
      expect(model[0]).toEqual(mappedModel);
    });

    // Assert
    const req = httpMock.expectOne(expectedUrl);
    expect(req.request.method).toBe('GET');

    req.flush({ data: [mockModelDto] });
  });

  it('should call GET with correct params and return mapped use cases', () => {
    // Arrange
    const useCaseId = '9';
    const userId = '123';
    const expectedUrl = `${service.generativeAIApiUrl}/${ApiEndpoints.prompt}`;

    //Act
    service.getPrompts(useCaseId, userId).subscribe((prompts) => {
      expect(prompts).toEqual([mappedPrompt]);
    });

    // Assert
    const req = httpMock.expectOne((request) => {
      return (
        request.url === expectedUrl &&
        request.params.get('useCaseId') === useCaseId &&
        request.params.get('userId') === userId
      );
    });

    expect(req.request.method).toBe('GET');

    req.flush({ data: [mockPromptDto] });
  });

  it('should POST to the correct URL with payload', () => {
    // Arrange
    const mockResponse = { success: true };
    const expectedUrl = `${service.generativeAIApiUrl}/${ApiEndpoints.savePrompt}`;

    // Act
    service.savePrompt(mockSavePromptPayload).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    // Assert
    const req = httpMock.expectOne(expectedUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockSavePromptPayload);

    req.flush(mockResponse);
  });

  it('should call PUT on correct URL with payload and return response', () => {
    // Arrange
    const mockResponse = { success: true };
    const expectedUrl = `${service.generativeAIApiUrl
      }/${ApiEndpoints.updatePrompt(mockUpdatePromptPayload.id!)}`;

    // Act
    service.updatePrompt(mockUpdatePromptPayload).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    //Assert
    const req = httpMock.expectOne(expectedUrl);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(mockUpdatePromptPayload);

    req.flush(mockResponse);
  });

  it('should call DELETE on correct URL and complete without returning data', () => {
    // Arrange
    const expectedUrl = `${service.generativeAIApiUrl
      }/${ApiEndpoints.deletePrompt(
        mockDeletePromptPayload.id!,
        mockDeletePromptPayload.userId!
      )}`;

    //Act
    service.deletePrompt(mockDeletePromptPayload).subscribe({
      next: (response) => {
        expect(response).toBeNull();
      },
      error: () => {
        fail('Expected successful DELETE call');
      },
    });

    // Assert
    const req = httpMock.expectOne(expectedUrl);
    expect(req.request.method).toBe('DELETE');

    req.flush(null, { status: 204, statusText: 'No Content' });
  });
});
