import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { CardViewComponent } from '@pages/dashboard/card-view/card-view.component';
import { projectFixture } from '@app/testing/fixtures';
import { ProjectType } from '@interfaces/project';

describe('CardViewComponent', () => {
  let component: CardViewComponent;
  let fixture: ComponentFixture<CardViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CardViewComponent],
    });
    fixture = TestBed.createComponent(CardViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('filters reactively when the project type changes', () => {
    const survey = projectFixture();
    const test = projectFixture({ id: 'test', type: ProjectType.TEST });
    fixture.componentRef.setInput('projects', [survey, test]);
    fixture.componentRef.setInput('type', ProjectType.QUESTIONNAIRE);
    expect(component.projectList().map((project) => project.id)).toEqual([survey.id]);
    fixture.componentRef.setInput('type', ProjectType.TEST);
    expect(component.projectList().map((project) => project.id)).toEqual([test.id]);
  });

  it('forwards create, edit, and delete requests', () => {
    const create = spyOn(component.createProject, 'emit');
    const edit = spyOn(component.editProject, 'emit');
    const remove = spyOn(component.deleteProject, 'emit');
    component.onCreateProject(ProjectType.TEST);
    component.onEditProject('one');
    component.onDeleteProject('two');
    expect(create).toHaveBeenCalledOnceWith(ProjectType.TEST);
    expect(edit).toHaveBeenCalledOnceWith('one');
    expect(remove).toHaveBeenCalledOnceWith('two');
  });
});
