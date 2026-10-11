import { appConfig } from '@app/app.config';
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { HeaderComponent } from '@components/header/header.component';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';
import { HeaderService } from '@services/header/header.service';
import { JsonService } from '@services/json.service';
import { EventService } from '@services/event.service';
import { ThemeEnum } from '@app/shared/enums/theme.enum';
import { LanguageEnum } from '@interfaces/language.enum';
import { MenuOption } from '@models/menu-option.model';
import { RoutePath } from '@models/route-path.model';
import { mockStorage, projectFixture } from '@app/testing/fixtures';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(() => {
    mockStorage({ theme: ThemeEnum.LIGHT });
    TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: appConfig.providers,
    });
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('restores saved language/theme and navigates home', () => {
    localStorage.setItem('language', LanguageEnum.HU);
    localStorage.setItem('theme', ThemeEnum.DARK);
    component.ngOnInit();
    expect(component.currentLanguage()).toBe(LanguageEnum.HU);
    expect(component.currentTheme()).toBe(ThemeEnum.DARK);
    const navigate = spyOn(TestBed.inject(Router), 'navigate').and.resolveTo(true);
    component.navigateToHome();
    expect(navigate).toHaveBeenCalledWith([RoutePath.DASHBOARD]);
  });

  it('uploads the selected file and ignores an empty file selection', () => {
    const upload = spyOn(component, 'uploadJson');
    component.onFileSelected({ target: { files: [] } } as unknown as Event);
    expect(upload).not.toHaveBeenCalled();
    const file = new File(['{}'], 'project.json');
    component.onFileSelected({ target: { files: [file] } } as unknown as Event);
    expect(upload).toHaveBeenCalledOnceWith(file);
  });

  afterEach(() => document.getElementById('theme-link')?.remove());

  it('toggles menu options while preserving available actions', () => {
    TestBed.inject(HeaderService).setOptions([MenuOption.SAVE, MenuOption.SIDEBAR], []);
    component.changeMenuItemState(MenuOption.SIDEBAR);
    expect(component.activeOptions()).toEqual([MenuOption.SIDEBAR]);
    component.changeMenuItemState(MenuOption.SIDEBAR);
    expect(component.activeOptions()).toEqual([]);
    expect(component.headerOptions()).toEqual([MenuOption.SAVE, MenuOption.SIDEBAR]);
  });

  it('forwards save, undo and custom actions', () => {
    const header = TestBed.inject(HeaderService);
    const save = spyOn(header, 'triggerSave');
    const undo = spyOn(header, 'triggerUndo');
    const callback = jasmine.createSpy('callback');
    component.handleSave();
    component.handleUndo();
    component.executeAction({ id: 'action', label: 'Action', type: 'default', callback });
    expect(save).toHaveBeenCalledTimes(1);
    expect(undo).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('persists language selection and switches translations', () => {
    const use = spyOn(TestBed.inject(TranslateService), 'use').and.returnValue(of({}));
    component.setLanguage(LanguageEnum.HU);
    expect(use).toHaveBeenCalledWith(LanguageEnum.HU);
    expect(component.currentLanguage()).toBe(LanguageEnum.HU);
    expect(localStorage.setItem).toHaveBeenCalledWith('language', LanguageEnum.HU);
  });

  it('replaces the theme stylesheet and publishes the selected theme', () => {
    component.setTheme(ThemeEnum.DARK);
    component.setTheme(ThemeEnum.DARK);
    expect(document.querySelectorAll('#theme-link')).toHaveSize(1);
    expect(TestBed.inject(EventService).themeChange.value).toBe(ThemeEnum.DARK);
    component.setTheme(ThemeEnum.LIGHT);
    expect(document.getElementById('theme-link')).toBeNull();
    expect(component.currentTheme()).toBe(ThemeEnum.LIGHT);
    expect(localStorage.setItem).toHaveBeenCalledWith('theme', ThemeEnum.LIGHT);
  });

  it('passes imported project data to the form creator', () => {
    const json = TestBed.inject(JsonService);
    const project = projectFixture();
    const imported = { project, type: project.type };
    spyOn(json, 'uploadJson').and.returnValue(of(imported));
    const set = spyOn(json, 'setJsonData');
    const navigate = spyOn(TestBed.inject(Router), 'navigate').and.resolveTo(true);
    component.uploadJson(new File(['{}'], 'project.json'));
    expect(set).toHaveBeenCalledWith(imported);
    expect(navigate).toHaveBeenCalledWith([RoutePath.NEW], {
      queryParams: { type: project.type },
      state: { projectData: imported },
    });
  });
});
