import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { DashboardComponent } from '@pages/dashboard/dashboard.component';
import { appConfig } from '@app/app.config';
import { ProjectService } from '@services/project.service';
import type { Project } from '@interfaces/project';
import { ProjectType } from '@interfaces/project';
import { Router } from '@angular/router';
import { RoutePath } from '@models/route-path.model';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: appConfig.providers,
    });
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('navigates to creation and editing with the correct parameters', () => {
    const navigate = spyOn(TestBed.inject(Router), 'navigate').and.resolveTo(true);
    component.createProject(ProjectType.TEST);
    expect(navigate).toHaveBeenCalledWith([RoutePath.NEW], {
      queryParams: { type: ProjectType.TEST },
    });
    component.createProject(ProjectType.QUESTIONNAIRE);
    expect(navigate).toHaveBeenCalledWith([RoutePath.NEW], {
      queryParams: { type: ProjectType.QUESTIONNAIRE },
    });
    component.editProject('project-1');
    expect(navigate).toHaveBeenCalledWith([RoutePath.EDIT], { queryParams: { id: 'project-1' } });
  });
  it('delegates deletion to project storage', () => {
    const remove = spyOn(TestBed.inject(ProjectService), 'remove');
    component.deleteProject('project-1');
    expect(remove).toHaveBeenCalledOnceWith('project-1');
  });

  it('allows switching views with Enter and Space', async () => {
    const toggle = fixture.nativeElement.querySelector('.toolbar [role="button"]') as HTMLElement;
    const initialView = component.isListView();
    expect(toggle.tabIndex).toBe(0);

    toggle.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true }),
    );
    await fixture.whenStable();
    expect(component.isListView()).toBe(!initialView);

    const spaceDown = new KeyboardEvent('keydown', { key: ' ', bubbles: true, cancelable: true });
    toggle.dispatchEvent(spaceDown);
    expect(spaceDown.defaultPrevented).toBeTrue();
    toggle.dispatchEvent(new KeyboardEvent('keyup', { key: ' ', bubbles: true }));
    await fixture.whenStable();
    expect(component.isListView()).toBe(initialView);
  });

  it('updates the view when a project is added without Zone.js', async () => {
    const project: Project = {
      id: '',
      title: 'Signal survey',
      description: '',
      type: ProjectType.QUESTIONNAIRE,
      time_checkbox: false,
      deadline_checkbox: false,
      time_limit: 0,
      deadline: '',
      created: '',
      modified: '',
    };
    TestBed.inject(ProjectService<Project>).add(project);
    await fixture.whenStable();

    expect(fixture.nativeElement.textContent).toContain('Signal survey');
    TestBed.inject(ProjectService<Project>).remove(project.id);
  });
});
