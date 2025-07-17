export const ApiEndpoints = {
  userAccessProjects: (userId: string | number): string =>
    `genai-project/list/${userId}`,
  savePrompt: `prompt/create`,
  updatePrompt: (id: string | number): string => `prompt/${id}`,
  useCaseByProjectId: (projectId: number | string) =>
    `use-case/project/${projectId}`,
  computeConcordance: 'compute-concordance/list',
  model: 'model/list',
  prompt: `prompt/list`,
  deletePrompt: (id: string | number, userId: string | number): string =>
    `prompt/${id}/${userId}`,
};
