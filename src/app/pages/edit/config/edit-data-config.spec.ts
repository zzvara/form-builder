import { TestBed } from '@angular/core/testing';
import { appConfig } from '@app/app.config';
import { TranslateService } from '@ngx-translate/core';
import { getInputGroups, getSideBarData, translateComponentType } from './edit-data-config';
import { EditComponent } from '../edit.component';
import { mockStorage, projectFixture, sectionFixture } from '@app/testing/fixtures';
import { FormBuilderStore } from '@app/core/form-builder.store';
import { ProjectType } from '@interfaces/project';

describe('Editor component defaults', () => {
  beforeEach(() => {
    mockStorage();
    TestBed.configureTestingModule({ providers: appConfig.providers });
  });

  it('provides renderable draft inputs with scripting disabled', () => {
    const inputs = getInputGroups(TestBed.inject(TranslateService));
    expect(inputs.length).toBeGreaterThan(0);
    expect(new Set(inputs.map((input) => input.type)).size).toBe(inputs.length);
    for (const input of inputs) {
      expect(translateComponentType[input.type]).withContext(input.type).toBeDefined();
      expect(input.data!.draft).withContext(input.type).toBeTrue();
      expect(input.codeEditor.enabled).withContext(input.type).toBeFalse();
    }
  });

  it('recomputes sidebar drop targets as sections change', () => {
    const fixture = TestBed.createComponent(EditComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();
    const sidebar = getSideBarData(component, TestBed.inject(TranslateService));
    expect(sidebar[0].dropListConnectedTo()).toEqual(['sectionDropList']);
    TestBed.inject(FormBuilderStore).project.set(
      projectFixture({
        type: ProjectType.QUESTIONNAIRE,
        editList: [{ id: 'new-section', data: sectionFixture('new-section') }],
      }),
    );
    fixture.detectChanges();
    expect(sidebar[0].dropListConnectedTo()).toEqual(['new-section', 'sectionDropList']);
    expect(sidebar[1].dropListConnectedTo()).toBe('sectionDropList');
    expect(sidebar[1].groupContents.map((input) => input.type)).toEqual([
      'SectionComponent',
      'RepeatedSectionComponent',
    ]);
  });
});
