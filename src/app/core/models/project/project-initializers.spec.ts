import { createProject, createProjectMetadata } from './project-initializers';
import { ProjectType } from './project-metadata.model';
import { createEmptySection, createTextField } from '../schema/schema-initializers';

const UUID_V4_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const ISO_TIMESTAMP_REGEX = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;

describe('project-initializers', () => {
  describe('createProjectMetadata', () => {
    it('creates default metadata with UUID, ISO timestamps, and initial version history', () => {
      const first = createProjectMetadata();
      const second = createProjectMetadata();

      expect(first.id).toMatch(UUID_V4_REGEX);
      expect(first.id).not.toBe(second.id);
      expect(first.title).toBe('');
      expect(first.description).toBe('');
      expect(first.type).toBe(ProjectType.QUESTIONNAIRE);
      expect(first.settings).toEqual({
        deadline: undefined,
        timeLimitMinutes: undefined,
      });
      expect(first.created).toMatch(ISO_TIMESTAMP_REGEX);
      expect(first.modified).toBe(first.created);
      expect(first.currentVersion).toBe(1);
      expect(first.history).toEqual([
        {
          versionNum: 1,
          created: first.created,
        },
      ]);
      expect(first.history).not.toBe(second.history);
      expect(first.settings).not.toBe(second.settings);
    });

    it('applies partial overrides to metadata', () => {
      const metadata = createProjectMetadata({
        id: 'proj-123',
        title: 'Midterm Exam',
        description: '<p>Read carefully</p>',
        type: ProjectType.TEST,
        settings: {
          deadline: '2026-12-31T23:59:59.000Z',
          timeLimitMinutes: 60,
        },
        currentVersion: 2,
        history: [
          { versionNum: 1, created: '2026-01-01T10:00:00.000Z' },
          { versionNum: 2, created: '2026-01-02T12:00:00.000Z', changeSummary: 'Added questions' },
        ],
      });

      expect(metadata.id).toBe('proj-123');
      expect(metadata.title).toBe('Midterm Exam');
      expect(metadata.description).toBe('<p>Read carefully</p>');
      expect(metadata.type).toBe(ProjectType.TEST);
      expect(metadata.settings).toEqual({
        deadline: '2026-12-31T23:59:59.000Z',
        timeLimitMinutes: 60,
      });
      expect(metadata.currentVersion).toBe(2);
      expect(metadata.history.length).toBe(2);
      expect(metadata.history[1].changeSummary).toBe('Added questions');
    });
  });

  describe('createProject', () => {
    it('creates a project with default metadata and an empty schema', () => {
      const project = createProject();

      expect(project.metadata.id).toMatch(UUID_V4_REGEX);
      expect(project.metadata.type).toBe(ProjectType.QUESTIONNAIRE);
      expect(project.metadata.currentVersion).toBe(1);
      expect(project.schema).toEqual({ components: [] });
    });

    it('accepts metadata and schema overrides', () => {
      const metadata = createProjectMetadata({ title: 'Feedback Survey' });
      const section = createEmptySection();
      const field = createTextField({ title: 'Comments' });

      const project = createProject({
        metadata,
        schema: { components: [section, field] },
      });

      expect(project.metadata).toBe(metadata);
      expect(project.schema.components).toEqual([section, field]);
    });
  });
});
