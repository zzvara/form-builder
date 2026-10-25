import { appConfig } from '@app/app.config';
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { ListViewComponent } from '@pages/dashboard/list-view/list-view.component';
import { projectFixture } from '@app/testing/fixtures';
import { ProjectType } from '@interfaces/project';
import { TranslateService } from '@ngx-translate/core';
import type { LangChangeEvent } from '@ngx-translate/core';
import { Subject } from 'rxjs';

describe('ListViewComponent', () => {
  let component: ListViewComponent;
  let fixture: ComponentFixture<ListViewComponent>;
  let languageChanges: Subject<LangChangeEvent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ListViewComponent],
      providers: appConfig.providers,
    });
    languageChanges = new Subject<LangChangeEvent>();
    spyOnProperty(TestBed.inject(TranslateService), 'onLangChange', 'get').and.returnValue(
      languageChanges.asObservable(),
    );
    fixture = TestBed.createComponent(ListViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('refreshes translated column labels until the component is destroyed', () => {
    const refresh = spyOn(component, 'setColumnsConfig').and.callThrough();
    languageChanges.next({ lang: 'hu', translations: {} });
    expect(refresh).toHaveBeenCalledTimes(1);
    fixture.destroy();
    languageChanges.next({ lang: 'en', translations: {} });
    expect(refresh).toHaveBeenCalledTimes(1);
  });

  it('sorts description and modification date columns', () => {
    const first = {
      ...projectFixture({ description: 'Alpha', modified: '2025-01-01' }),
      type: ProjectType.QUESTIONNAIRE as const,
    };
    const second = {
      ...projectFixture({ description: 'Beta', modified: '2026-01-01' }),
      type: ProjectType.QUESTIONNAIRE as const,
    };
    for (const index of [1, 3]) {
      const sort = component.columnsConfig()[index].sortFn;
      if (typeof sort !== 'function') throw new Error('Missing comparator');
      expect(sort(first, second)).toBeLessThan(0);
      expect(sort(second, first)).toBeGreaterThan(0);
    }
  });

  it('filters projects and supplies working title and date comparators', () => {
    const first = projectFixture({ title: 'Alpha', created: '2025-01-01' });
    const second = projectFixture({ title: 'Beta', type: ProjectType.TEST, created: '2026-01-01' });
    fixture.componentRef.setInput('projects', [first, second]);
    fixture.componentRef.setInput('type', ProjectType.QUESTIONNAIRE);
    expect(component.projectList().map((project) => project.title)).toEqual(['Alpha']);
    const titleSort = component.columnsConfig()[0].sortFn;
    const dateSort = component.columnsConfig()[2].sortFn;
    if (typeof titleSort !== 'function' || typeof dateSort !== 'function')
      throw new Error('Missing column comparators');
    const firstSurvey = { ...first, type: ProjectType.QUESTIONNAIRE as const };
    const secondSurvey = { ...second, type: ProjectType.QUESTIONNAIRE as const };
    expect(titleSort(firstSurvey, secondSurvey)).toBeLessThan(0);
    expect(dateSort(firstSurvey, secondSurvey)).toBeLessThan(0);
  });

  it('forwards edit and delete requests', () => {
    const edit = spyOn(component.editProject, 'emit');
    const remove = spyOn(component.deleteProject, 'emit');
    component.onEditProject('one');
    component.onDeleteProject('two');
    expect(edit).toHaveBeenCalledOnceWith('one');
    expect(remove).toHaveBeenCalledOnceWith('two');
  });
});
