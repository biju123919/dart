import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, map, mergeMap, Observable } from 'rxjs';
import { ApiEndpoints } from '../../@core/constants/api-endpoints';
import { AppConfigService } from '../../@core/service/app.config.service';
import { ComputeConcordance, Model, Project, ProjectUseCaseDetails, Prompt, UseCase } from '../../@core/model/dto/entity.model';
import { mapComputeConcordanceEntityDtoToModel, mapModelEntityDtoToModel, mapProjectEntityDtoToModel, mapPromptEntityDtoToModel, mapToProjectUseCaseEntity, mapUseCaseEntityDtoToModel } from '../../@core/mapper/entity.mapper';
import { ComputeConcordanceDTO, ModelDTO, ProjectDTO, PromptDTO, UseCaseDTO } from '../../@core/model/dto/entity.dto';
import { DeletePromptPayload, PostExecutePromptPayload, SaveOrUpdatePromptPayload } from '../../@core/model/dto/payload.dto';

@Injectable({
  providedIn: 'root',
})
export class GenerativeAIService {
  generativeAIApiUrl = '';
  constructor(
    private http: HttpClient,
    private appConfigService: AppConfigService
  ) {
    this.generativeAIApiUrl =
      this.appConfigService.environment.api.generativeAIUrl;
  }

  // getProjectsWithUseCases(userId: string): Observable<Array<{ project: Project; useCases: UseCase[] }>> {
  //   return this.getUserAccessProjects(userId).pipe(
  //     mergeMap((projects: Project[]) => {
  //       const projectUseCaseCalls = projects.map(project =>
  //         this.getUseCasesByProjectId(Number(project.id)).pipe(
  //           map(useCases => ({ project, useCases }))
  //         )
  //       );
  //       return forkJoin(projectUseCaseCalls);
  //     })
  //   );
  // }

  getProjectsWithUseCases(userId: string): Observable<ProjectUseCaseDetails[]> {
    return this.getUserAccessProjects(userId).pipe(
      mergeMap((projects: Project[]) => {
        const projectUseCaseCalls = projects.map(project =>
          this.getUseCasesByProjectId(Number(project.id)).pipe(
            map(useCases => mapToProjectUseCaseEntity({ project, useCases }))
          )
        );
        return forkJoin(projectUseCaseCalls);
      })
    );
  }

  getUserAccessProjects(userId: string): Observable<Project[]> {
    const apiUrl = `${this.generativeAIApiUrl
      }/${ApiEndpoints.userAccessProjects(userId)}`;
    return this.http
      .get<{ data: ProjectDTO[] }>(apiUrl)
      .pipe(map((response) => response.data.map(mapProjectEntityDtoToModel)));
  }

  getUseCasesByProjectId(projectId: number): Observable<UseCase[]> {
    const apiUrl = `${this.generativeAIApiUrl
      }/${ApiEndpoints.useCaseByProjectId(projectId)}`;
    return this.http
      .get<{ data: UseCaseDTO[] }>(apiUrl)
      .pipe(map((response) => response.data.map(mapUseCaseEntityDtoToModel)));
  }

  getComputeConcordances(): Observable<ComputeConcordance[]> {
    const apiUrl = `${this.generativeAIApiUrl}/${ApiEndpoints.computeConcordance}`;
    return this.http
      .get<{ data: ComputeConcordanceDTO[] }>(apiUrl)
      .pipe(
        map((response) =>
          response.data.map(mapComputeConcordanceEntityDtoToModel)
        )
      );
  }

  getModels(): Observable<Model[]> {
    const apiUrl = `${this.generativeAIApiUrl}/${ApiEndpoints.model}`;
    return this.http
      .get<{ data: ModelDTO[] }>(apiUrl)
      .pipe(map((response) => response.data.map(mapModelEntityDtoToModel)));
  }

  getPrompts(useCaseId: string, userId: string): Observable<Prompt[]> {
    const apiUrl = `${this.generativeAIApiUrl}/${ApiEndpoints.prompt}`;
    const params = new HttpParams()
      .set('useCaseId', useCaseId)
      .set('userId', userId);
    return this.http
      .get<{ data: PromptDTO[] }>(apiUrl, { params })
      .pipe(map((response) => response.data.map(mapPromptEntityDtoToModel)));
  }

  saveOrUpdatePrompt(payload: SaveOrUpdatePromptPayload): Observable<any> {
    const url = `${this.generativeAIApiUrl}/${ApiEndpoints.saveOrUpdatePrompt}`;
    return this.http.post(url, payload);
  }

  deletePrompt(payload: DeletePromptPayload): Observable<Prompt[]> {
    const url = `${this.generativeAIApiUrl}/${ApiEndpoints.deletePrompt(
      payload.id!,
      payload.userId!
    )}`;
    return this.http.delete<Prompt[]>(url);
  }

  postPromptExecution(payload: PostExecutePromptPayload): Observable<any> {
    const url = `${this.generativeAIApiUrl}/prompt-execution/execute`;
    return this.http.post(url, payload);
  }
}
