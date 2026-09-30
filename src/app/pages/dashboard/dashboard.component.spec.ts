import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardComponent } from '@pages/dashboard/dashboard.component';
import { appConfig } from '@app/app.config';
import { ProjectService } from '@services/project.service';
import { Project, ProjectType } from '@interfaces/project';
import { provideZonelessChangeDetection } from '@angular/core';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: [...appConfig.providers, provideZonelessChangeDetection()],
    });
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
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
