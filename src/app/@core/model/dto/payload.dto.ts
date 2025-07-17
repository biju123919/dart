export interface CreateCoursePayload {
  Name: string;
  Text: string;
  caseId: string;
  userId: string;
}

export interface SavePromptPayload {
  promptName?: string;
  promptText?: string;
  useCaseId?: string;
  userId?: string;
}

export interface UpdatePromptPayload {
  id?: string;
  useCaseId?: string;
  promptName?: string;
  promptText?: string;
  userId?: string;
}

export interface DeletePromptPayload {
  id?: string;
  userId?: string;
}
