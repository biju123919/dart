export interface CreateCoursePayload {
  Name: string;
  Text: string;
  caseId: string;
  userId: string;
}

export interface SaveOrUpdatePromptPayload {
  promptName?: string;
  promptText?: string;
  useCaseId?: string;
  userId?: string;
}

export interface DeletePromptPayload {
  id?: string;
  userId?: string;
}

export interface PostExecutePromptPayload {
  userId?: string,
  useCaseId: number,
  computeConcordanceId: number,
  modelId: number,
  reportToProcessStart: number,
  reportToProcessEnd: number,
  promptAId: number | null,
  promptBId: number | null,
  promptCId: number | null,
  PromptAText?: string,
  PromptBText?: string,
  PromptCText?: string
}
