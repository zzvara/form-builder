import { v4 as uuidv4 } from 'uuid';
import { createEmptySchema } from '../schema/schema-initializers';
import { type ProjectMetadata, ProjectType } from './project-metadata.model';
import type { Project } from './project.model';

export function createProjectMetadata(overrides?: Partial<ProjectMetadata>): ProjectMetadata {
  const now = new Date().toISOString();

  return {
    id: uuidv4(),
    title: '',
    description: '',
    type: ProjectType.QUESTIONNAIRE,
    settings: {
      deadline: undefined,
      timeLimitMinutes: undefined,
    },
    created: now,
    modified: now,
    currentVersion: 1,
    history: [
      {
        versionNum: 1,
        created: now,
      },
    ],
    ...overrides,
  };
}

export function createProject(
  overrides?: Partial<Project>,
): Project {
  const metadata = createProjectMetadata(overrides?.metadata);
  return {
    metadata,
    schema: overrides?.schema ?? createEmptySchema(),
    ...overrides,
  };
}