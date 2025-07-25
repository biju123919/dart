export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Project {
  id: string | number;
  externalId: string;
  name: string;
  shortName: string;
  longName: string;
  description: string;
}

export interface UseCase {
  id: string | number;
  projectId: string | number;
  label: string;
}

export interface ComputeConcordance {
  id: string | number;
  label: string;
}

export interface Model {
  id: string | number;
  label: string;
}

export interface Prompt {
  id: string | number;
  promptName: string;
  promptText: string;
  useCaseId: string | number;
  userId: string | number;
}

export interface ModalConfig {
  title: string;
  content: string;
  onSave: (inputValue?: string) => void;
  isNameExists?: boolean;
  fontColor?: string;
  isWarning?: boolean;
  data?: any;
  showInput?: boolean;
  confirmButtonText?: string;
  cancelButtonText?: string;
  showDeclineIcon?: boolean;
  showTitle?: boolean;
  showSuccessIcon?: boolean;
}



export interface ProjectUseCaseDetails {
  id: string | number;
  externalId: string;
  name: string;
  shortName: string;
  longName: string;
  description: string;
  useCaseDetails: UseCaseDetails[];
}

export interface UseCaseDetails {
  id: string | number;
  projectId: string | number;
  label: string;
}