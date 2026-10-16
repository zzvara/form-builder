import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import type { Project } from '@interfaces/project';
import { ProjectType } from '@interfaces/project';
import { ProjectService } from './project.service';

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
