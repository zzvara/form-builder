import { appConfig } from '@app/app.config';
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { EditComponent } from '@pages/edit/edit.component';
import type { EditList } from './interfaces/edit-list';
import type { FormInputData } from '@interfaces/form-input-data';
import type { SectionList } from './interfaces/section-list';
import { LayoutEnum } from './interfaces/layout-enum';

describe('EditComponent', () => {
  let component: EditComponent;
  let fixture: ComponentFixture<EditComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [EditComponent],
      providers: appConfig.providers,
    });
    fixture = TestBed.createComponent(EditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('unwraps a top-level input when moving it into a section', () => {
    const input: FormInputData = {
      title: 'Question',
      type: 'InputComponent',
      data: { id: 'input', questionValue: 'Question' },
      codeEditor: { enabled: false },
    };
    const wrapped: EditList = { id: 'input', data: input };
    const section: SectionList = {
      sectionId: 'section',
      type: 'SectionComponent',
      layout: LayoutEnum.VERTICAL,
      sectionInputs: [],
      data: { id: 'section', sectionId: 'section' },
      codeEditor: { enabled: false },
      reorderEnabled: false,
    };
    component.editList = [wrapped, { id: 'section', data: section }];
    component.dropIntoSection({
      previousContainer: { id: 'sectionDropList', data: component.editList },
      container: { id: 'section', data: section.sectionInputs },
      previousIndex: 0,
      currentIndex: 0,
      item: { data: wrapped },
    } as Parameters<EditComponent['dropIntoSection']>[0]);

    expect(section.sectionInputs).toEqual([input]);
    expect(component.editList.map((item) => item.id)).toEqual(['section']);
  });
});
