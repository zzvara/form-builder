import type { FormSchema } from '../schema';
import type { ProjectMetadata } from './project-metadata.model';

export interface Project {
  metadata: ProjectMetadata
  schema: FormSchema;
}