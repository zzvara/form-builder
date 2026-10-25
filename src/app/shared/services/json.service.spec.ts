import { TestBed } from '@angular/core/testing';

import { JsonService } from '@services/json.service';
import { firstValueFrom } from 'rxjs';
import { projectFixture } from '@app/testing/fixtures';
import type { Project } from '@interfaces/project';

describe('JsonService', () => {
  let service: JsonService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JsonService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  for (const event of ['error', 'load']) {
    it(`reports a FileReader ${event === 'error' ? 'failure' : 'missing result'}`, async () => {
      const reader = new FileReader();
      spyOn(window, 'FileReader').and.returnValue(reader);
      spyOn(reader, 'readAsText');
      const result = firstValueFrom(
        service.uploadJson(new File(['{}'], 'project.json', { type: 'application/json' })),
      );
      const expectation = expectAsync(result).toBeRejectedWithError(
        event === 'error'
          ? 'Failed to read file'
          : 'Failed to parse JSON file. Please ensure the file is valid.',
      );
      reader.dispatchEvent(new ProgressEvent(event));
      await expectation;
    });
  }

  it('publishes and clears imported data through both public APIs', () => {
    const changed = jasmine.createSpy('changed');
    const completed = jasmine.createSpy('completed');
    const subscription = service.getJsonData().subscribe({ next: changed, complete: completed });
    const data = { project: projectFixture() };
    service.setJsonData(data);
    expect(service.jsonData()).toBe(data);
    expect(changed).toHaveBeenCalledWith(data);
    service.clearJsonData();
    expect(service.jsonData()).toBeNull();
    service.destroy();
    expect(completed).toHaveBeenCalled();
    subscription.unsubscribe();
  });

  it('imports JSON, clears the old id, and preserves history', async () => {
    const project = projectFixture();
    const history = [{ project, versionNum: 1, created: '2026-01-01' }];
    const result = await firstValueFrom(
      service.uploadJson(
        new File([JSON.stringify({ project, history })], 'survey.json', {
          type: 'application/json',
        }),
      ),
    );
    expect(result.project.id).toBe('');
    expect(result.project.title).toBe(project.title);
    expect(result.project.modified).toBe(new Date().toISOString().split('T')[0]);
    expect(result.history).toEqual(history);
  });

  it('rejects non-JSON files and malformed or missing project data', async () => {
    await expectAsync(
      firstValueFrom(service.uploadJson(new File(['text'], 'file.txt', { type: 'text/plain' }))),
    ).toBeRejectedWithError('Invalid file type. Please upload a JSON file.');
    for (const contents of ['{broken', '{}']) {
      await expectAsync(
        firstValueFrom(
          service.uploadJson(new File([contents], 'file.json', { type: 'application/json' })),
        ),
      ).toBeRejectedWithError('Failed to parse JSON file. Please ensure the file is valid.');
    }
  });

  it('exports the project and revokes the generated download URL', async () => {
    const create = spyOn(URL, 'createObjectURL').and.returnValue('blob:test');
    const revoke = spyOn(URL, 'revokeObjectURL');
    const anchor = document.createElement('a');
    spyOn(anchor, 'click');
    spyOn(document, 'createElement').and.returnValue(anchor);
    const project = projectFixture();
    service.saveProjectToJson(project);
    expect(anchor.download).toBe('project_project-1.json');
    expect(anchor.click).toHaveBeenCalled();
    expect(revoke).toHaveBeenCalledOnceWith('blob:test');
    const blob = create.calls.mostRecent().args[0] as Blob;
    expect(blob.type).toBe('application/json');
    expect(JSON.parse(await blob.text())).toEqual({ project });
  });

  it('exports history and releases the URL even when clicking fails', async () => {
    const create = spyOn(URL, 'createObjectURL').and.returnValue('blob:test');
    const revoke = spyOn(URL, 'revokeObjectURL');
    const anchor = document.createElement('a');
    spyOn(document, 'createElement').and.returnValue(anchor);
    spyOn(anchor, 'click').and.throwError('Download failed');
    const project = projectFixture();
    expect(() => service.saveProjectWithHistoryToJson(project, [])).toThrowError('Download failed');
    expect(anchor.download).toBe('project_project-1_history.json');
    expect(revoke).toHaveBeenCalledOnceWith('blob:test');
    expect(JSON.parse(await (create.calls.mostRecent().args[0] as Blob).text())).toEqual({
      project,
      history: [],
    });
  });

  it('rejects exports without a project id before creating a download', () => {
    const invalid = { ...projectFixture(), id: undefined } as unknown as Project;
    const create = spyOn(URL, 'createObjectURL');
    expect(() => service.saveProjectToJson(invalid)).toThrowError('Invalid project data');
    expect(() => service.saveProjectWithHistoryToJson(invalid, [])).toThrowError(
      'Invalid project data',
    );
    expect(create).not.toHaveBeenCalled();
  });
});
