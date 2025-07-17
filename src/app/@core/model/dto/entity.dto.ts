export interface ProjectDTO {
  id: string | number;
  projectExternalId: string;
  name: string;
  shortName: string;
  longName: string;
  description: string;
}

export interface UseCaseDTO {
  id: string | number;
  projectId: string | number;
  useCaseName: string;
  recordCount: string;
  s3Path: string;
}

export interface ComputeConcordanceDTO {
  id: string | number;
  name: string;
}

export interface ModelDTO {
  id: string | number;
  name: string;
}

export interface PromptDTO {
  id: string | number;
  promptName: string;
  promptText: string;
  useCaseId: string | number;
  userId: string | number;
}
