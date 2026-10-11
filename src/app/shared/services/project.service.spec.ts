import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import type { Project } from '@interfaces/project';
import { ProjectType } from '@interfaces/project';
import { ProjectService } from './project.service';
import { mockStorage, projectFixture } from '@app/testing/fixtures';

describe('ProjectService signals', () => {
  it('updates the project list when projects are added and removed', () => {
    spyOn(localStorage, 'getItem').and.returnValue(null);
    spyOn(localStorage, 'setItem');
    spyOn(localStorage, 'removeItem');
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
    const service = TestBed.inject(ProjectService<Project>);
    const project: Project = {
      id: '',
      title: 'Survey',
      description: '',
      type: ProjectType.QUESTIONNAIRE,
      time_checkbox: false,
      deadline_checkbox: false,
      time_limit: 0,
      deadline: '',
      created: '',
      modified: '',
    };

    expect(service.projects()).toEqual([]);
    const emissions: Project[][] = [];
    const subscription = service.list().subscribe((projects) => emissions.push(projects));
    service.add(project);
    expect(service.projects()).toEqual([project]);
    service.remove(project.id);
    expect(service.projects()).toEqual([]);
    expect(emissions).toEqual([[], [project], []]);
    subscription.unsubscribe();
  });
});

describe('ProjectService persistence', () => {
  let storage: Map<string, string>;
  let service: ProjectService<Project>;

  beforeEach(() => {
    storage = mockStorage();
    service = new ProjectService<Project>();
  });

  it('loads existing projects on construction', () => {
    const project = projectFixture();
    storage.set('project', JSON.stringify([project]));
    expect(new ProjectService<Project>().projects()).toEqual([project]);
  });

  it('assigns unique ids, persists new projects, and creates an initial version', () => {
    const first = projectFixture({ id: '' });
    const second = projectFixture({ id: '' });
    service.add(first);
    service.add(second);
    expect(first.id).toBeTruthy();
    expect(first.id).not.toBe(second.id);
    expect(first.created).toBe(new Date().toISOString().split('T')[0]);
    expect(JSON.parse(storage.get('project')!)).toEqual([first, second]);
    expect(service.getProjectVersion(first.id, 1)).toEqual(first);
  });

  it('updates projects, preserves previous data, and supports reverting', () => {
    const project = projectFixture();
    service.add(project);
    const updated = { ...project, title: 'Revised' };
    expect(service.update(project.id, updated)).toBeTrue();
    expect(service.searchData(project.id)[0].title).toBe('Revised');
    expect(service.getProjectHistory(project.id)).toHaveSize(2);
    expect(service.getProjectVersion(project.id, 2)!.title).toBe('Revised');
    expect(service.getProjectVersion(project.id, 1)!.title).toBe('Survey');
    expect(service.update(project.id, { ...updated })).toBeFalse();
    expect(service.getProjectHistory(project.id)).toHaveSize(2);
    expect(service.revertToVersion(project.id, 1)).toBeTrue();
    expect(service.searchData(project.id)[0].title).toBe('Survey');
    expect(service.revertToVersion(project.id, 999)).toBeFalse();
  });

  it('ignores unknown ids and unchanged initial data', () => {
    const project = projectFixture();
    expect(service.update('missing', project)).toBeFalse();
    expect(service.getProjectVersion('missing', 1)).toBeUndefined();
    expect(service.getProjectHistory('missing')).toEqual([]);
    service.add(project);
    expect(service.update(project.id, { ...project })).toBeFalse();
  });
  
  it('backfills legacy history and removes history together with a project', () => {
    const project = projectFixture();
    storage.set('project', JSON.stringify([project]));
    service = new ProjectService<Project>();
    expect(service.getProjectHistory(project.id)[0].versionNum).toBe(1);
    expect(storage.has(`project-history-${project.id}`)).toBeTrue();
    service.remove(project.id);
    expect(service.projects()).toEqual([]);
    expect(storage.has(`project-history-${project.id}`)).toBeFalse();
  });

  it('handles legacy records without creation dates and orphaned history', () => {
    const project = projectFixture({ created: '' });
    storage.set('project', JSON.stringify([project]));
    service = new ProjectService<Project>();
    expect(Number.isNaN(Date.parse(service.getProjectHistory(project.id)[0].created))).toBeFalse();
    storage.set(
      'project-history-orphan',
      JSON.stringify([{ versionNum: 1, project, created: '2026-01-01' }]),
    );
    expect(service.revertToVersion('orphan', 1)).toBeFalse();
  });
});
