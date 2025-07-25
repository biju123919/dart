import { ComputeConcordanceDTO, ModelDTO, ProjectDTO, PromptDTO, UseCaseDTO } from "../model/dto/entity.dto";
import { ComputeConcordance, Model, Project, ProjectUseCaseDetails, Prompt, UseCase } from "../model/dto/entity.model";

export function mapProjectEntityDtoToModel(dto: ProjectDTO): Project {
  return {
    id: dto.id,
    externalId: dto.projectExternalId,
    name: dto.name,
    shortName: dto.shortName,
    longName: dto.longName,
    description: dto.description
  };
}

export function mapUseCaseEntityDtoToModel(dto: UseCaseDTO): UseCase {
  return {
    id: dto.id,
    label: dto.useCaseName,
    projectId: dto.projectId,
  };
}

export function mapComputeConcordanceEntityDtoToModel(
  dto: ComputeConcordanceDTO
): ComputeConcordance {
  return {
    id: dto.id,
    label: dto.name,
  };
}

export function mapModelEntityDtoToModel(dto: ModelDTO): Model {
  return {
    id: dto.id,
    label: dto.name,
  };
}

export function mapPromptEntityDtoToModel(dto: PromptDTO): Prompt {
  return {
    id: dto.id,
    promptName: dto.promptName,
    promptText: dto.promptText,
    useCaseId: dto.useCaseId,
    userId: dto.userId,
  };
}


export function mapToProjectUseCaseEntity(data: { project: Project; useCases: UseCase[] }): ProjectUseCaseDetails {
  return {
    id: data.project.id,
    externalId: data.project.externalId,
    name: data.project.name,
    shortName: data.project.shortName,
    longName: data.project.longName,
    description: data.project.description,
    useCaseDetails: data.useCases.map(h => ({
      id: h.id,
      projectId: h.projectId,
      label: h.label
    })),
  };
}



