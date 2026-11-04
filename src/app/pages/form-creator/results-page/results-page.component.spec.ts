import { appConfig } from '@app/app.config';
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { ResultsPageComponent } from '@pages/form-creator/results-page/results-page.component';
import { Router } from '@angular/router';
import { ProjectService } from '@services/project.service';
import { JsonService } from '@services/json.service';
import { ProjectType } from '@interfaces/project';
import { inputFixture, mockStorage, projectFixture, sectionFixture } from '@app/testing/fixtures';

describe('ResultsPageComponent', () => {
  let component: ResultsPageComponent;
  let fixture: ComponentFixture<ResultsPageComponent>;

  beforeEach(() => {
    mockStorage();
    TestBed.configureTestingModule({
      imports: [ResultsPageComponent],
      providers: appConfig.providers,
    });
    fixture = TestBed.createComponent(ResultsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('leaves results empty for a missing project and provides question comparators', () => {
    component.projectId = 'missing';
    component.ngOnInit();
    expect(component.project()).toBeUndefined();
    expect(component.projectHistory()).toEqual([]);
    const first = {
      ...projectFixture({ title: 'Alpha', description: 'Alpha' }),
      type: ProjectType.QUESTIONNAIRE as const,
    };
    const second = {
      ...projectFixture({ title: 'Beta', description: 'Beta' }),
      type: ProjectType.QUESTIONNAIRE as const,
    };
    for (const column of component.columnsConfig) {
      if (typeof column.sortFn !== 'function') throw new Error('Missing comparator');
      expect(column.sortFn(first, second)).toBeLessThan(0);
    }
  });

  it('loads the latest version and collects its section inputs', () => {
    const service = TestBed.inject(ProjectService);
    const input = inputFixture();
    const project = projectFixture({
      editList: [{ id: 'section', data: sectionFixture('section', [input]) }],
    });
    service.add(project);
    service.update(project.id, { ...project, title: 'Revised' });
    component.projectId = project.id;
    component.ngOnInit();
    expect(component.latestVersionNum()).toBe(2);
    expect(component.project()!.title).toBe('Revised');
    expect(component.sectionInputs()).toEqual([input]);
    expect(component.sectionInputStats()).toEqual({ Text: 1 });
  });

  it('exports either the current project or the project with history', () => {
    const json = TestBed.inject(JsonService);
    const save = spyOn(json, 'saveProjectToJson');
    const history = spyOn(json, 'saveProjectWithHistoryToJson');
    component.saveProjectToJson();
    component.saveProjectWithHistoryToJson();
    expect(save).not.toHaveBeenCalled();
    expect(history).not.toHaveBeenCalled();
    const project = projectFixture();
    component.project.set(project);
    component.saveProjectToJson();
    component.saveProjectWithHistoryToJson();
    expect(save).toHaveBeenCalledWith(project);
    expect(history).toHaveBeenCalledWith(project, []);
  });

  it('returns home when the wizard finishes', () => {
    const navigate = spyOn(TestBed.inject(Router), 'navigate').and.resolveTo(true);
    const emit = spyOn(component.setPage, 'emit');
    component.page = 2;
    component.nextPage();
    expect(emit).toHaveBeenCalledWith(3);
    expect(navigate).toHaveBeenCalledWith(['/']);
  });
});
