import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ApiEndpoints } from '../../@core/constants/api-endpoints';
import { AppConfigService } from '../../@core/service/app.config.service';
import { ComputeConcordance, Model, Project, Prompt, UseCase } from '../../@core/model/dto/entity.model';
import { mapComputeConcordanceEntityDtoToModel, mapModelEntityDtoToModel, mapProjectEntityDtoToModel, mapPromptEntityDtoToModel, mapUseCaseEntityDtoToModel } from '../../@core/mapper/entity.mapper';
import { ComputeConcordanceDTO, ModelDTO, ProjectDTO, PromptDTO, UseCaseDTO } from '../../@core/model/dto/entity.dto';
import { DeletePromptPayload, SavePromptPayload, UpdatePromptPayload } from '../../@core/model/dto/payload.dto';

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

  savePrompt(payload: SavePromptPayload) {
    const url = `${this.generativeAIApiUrl}/${ApiEndpoints.savePrompt}`;
    return this.http.post(url, payload);
  }

  updatePrompt(payload: UpdatePromptPayload): Observable<any> {
    const url = `${this.generativeAIApiUrl}/${ApiEndpoints.updatePrompt(
      payload.id!
    )}`;
    return this.http.put(url, payload);
  }

  deletePrompt(payload: DeletePromptPayload): Observable<Prompt[]> {
    const url = `${this.generativeAIApiUrl}/${ApiEndpoints.deletePrompt(
      payload.id!,
      payload.userId!
    )}`;
    return this.http.delete<Prompt[]>(url);
  }
}
