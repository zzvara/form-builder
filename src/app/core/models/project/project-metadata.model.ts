import type { Project } from "./project.model";

/** Represents a string containing HTML/XML from a rich text editor */
export type RichTextString = string;

export enum ProjectType {
  QUESTIONNAIRE = 'questionnaire',
  TEST = 'test',
}

/**
 * Lightweight audit entry representing a specific version in the project history
 */
export interface ProjectVersionHistoryEntry {
  versionNum: number;
  created: string;

  /** Optional summary or note of what changed in this version */
  changeSummary?: string;
}

/**
 * Audit entry containing the full snapshot
 */
export interface ProjectVersionSnapshot {
  versionNum: number;
  created: string;
  changeSummary?: string;
  project: Project;
}

/**
 * Configuration for time restrictions (deadline and duration limit)
 */
export interface AssessmentSettings {
  deadline?: string;
  /** Optional time limit in minutes */
  timeLimitMinutes?: number;
}

/**
 * Core metadata describing a form project
 */
export interface ProjectMetadata {
  id: string;
  title: string;
  description: RichTextString;
  type: ProjectType;
  settings: AssessmentSettings;
  created: string;
  modified: string;

  /** Current active version number (defaults to 1) */
  currentVersion: number;

  /** Audit log of saved versions */
  history: ProjectVersionHistoryEntry[];
}