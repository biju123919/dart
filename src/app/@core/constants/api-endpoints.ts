export const ApiEndpoints = {
  userAccessProjects: (userId: string | number): string =>
    `genai-project/list/${userId}`,
  saveOrUpdatePrompt: `prompt/update`,
  useCaseByProjectId: (projectId: number | string) =>
    `use-case/project/${projectId}`,
  computeConcordance: 'compute-concordance/list',
  model: 'model/list',
  prompt: `prompt/list`,
  deletePrompt: (id: string | number, userId: string | number): string =>
    `prompt/${id}/${userId}`,
};
