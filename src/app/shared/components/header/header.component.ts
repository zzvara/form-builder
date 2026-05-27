import { Component, OnDestroy, OnInit, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';

import { ContextAction } from '@components/header/header.model';
import { MenuOption } from '@models/menu-option.model';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { HeaderService } from '@services/header/header.service';
import { JsonService } from '@services/json.service';
import { RoutePath } from '@app/shared/models/route-path.model';
import { LocalStorageKey } from '@app/shared/constants/localStorage.constant';
import { LanguageEnum } from '@app/shared/interfaces/language.enum';
import { ThemeEnum } from '@app/shared/enums/theme.enum';
import { EventService } from '@app/shared/services/event.service';

import { NzHeaderComponent } from 'ng-zorro-antd/layout';
import { NzDropdownModule } from 'ng-zorro-antd/dropdown';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMenuModule } from 'ng-zorro-antd/menu';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.less'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    NzHeaderComponent,
    TranslatePipe,
    NzDropdownModule,
    NzIconModule,
    NzMenuModule,
  ],
})
export class HeaderComponent implements OnInit, OnDestroy {
  private readonly router = inject(Router);
  private readonly headerService = inject(HeaderService);
  private readonly jsonService = inject(JsonService);
  private readonly translate = inject(TranslateService);
  private readonly eventService = inject(EventService);

  readonly menuOptions = MenuOption;
  headerOptions = this.headerService.headerOptions;
  activeOptions = this.headerService.activeOptions;
  contextActions = this.headerService.contextActions;

  LanguageEnum = LanguageEnum;
  ThemeEnum = ThemeEnum;

  currentLanguage = signal<LanguageEnum>(LanguageEnum.EN);
  currentTheme = signal<ThemeEnum>(ThemeEnum.LIGHT);

  ngOnInit(): void {
    const savedLang = localStorage.getItem(LocalStorageKey.LANGUAGE);
    const lang = savedLang === LanguageEnum.HU ? LanguageEnum.HU : LanguageEnum.EN;
    this.currentLanguage.set(lang);
    this.translate.use(lang);

    this.jsonService.clearJsonData();

    const savedTheme = localStorage.getItem(LocalStorageKey.THEME);
    const theme = savedTheme === ThemeEnum.DARK ? ThemeEnum.DARK : ThemeEnum.LIGHT;
    this.currentTheme.set(theme);

    if (theme === ThemeEnum.DARK) {
      this.applyDarkThemeCss();
    }
    this.eventService.themeChange.next(theme);
  }

  ngOnDestroy(): void {
    this.jsonService.destroy();
  }

  navigateToHome(): void {
    this.router.navigate([RoutePath.DASHBOARD]);
  }

  changeMenuItemState(toChange: MenuOption) {
    const currentActive = this.activeOptions();
    const currentHeaders = this.headerOptions();
    const isCurrentlyActive = currentActive.includes(toChange);

    const updatedActive = isCurrentlyActive
      ? currentActive.filter((option: MenuOption) => option !== toChange)
      : [...currentActive, toChange];

    this.headerService.setOptions(currentHeaders, updatedActive);
  }

  executeAction(action: ContextAction): void {
    action.callback();
  }

  handleSave(): void {
    this.headerService.triggerSave();
  }

  handleUndo(): void {
    this.headerService.triggerUndo();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.uploadJson(input.files[0]);
    }
  }

  uploadJson(file: File): void {
    this.jsonService.uploadJson(file)
      .pipe(takeUntilDestroyed())
      .subscribe((data) => {
        this.jsonService.setJsonData(data);
        this.router.navigate([RoutePath.NEW], {
          queryParams: { type: data.type },
          state: { projectData: data },
        });
      });
  }

  setLanguage(lang: LanguageEnum): void {
    this.currentLanguage.set(lang);
    this.translate.use(lang);
    localStorage.setItem(LocalStorageKey.LANGUAGE, lang);
  }

  setTheme(theme: ThemeEnum): void {
    localStorage.setItem(LocalStorageKey.THEME, theme);
    this.currentTheme.set(theme);
    this.eventService.themeChange.next(theme);

    const existingLink = document.getElementById('theme-link') as HTMLLinkElement | null;
    if (existingLink) {
      existingLink.parentNode?.removeChild(existingLink);
    }

    if (theme === ThemeEnum.DARK) {
      this.applyDarkThemeCss();
    }
  }

  private applyDarkThemeCss(): void {
    const link = document.createElement('link');
    link.id = 'theme-link';
    link.rel = 'stylesheet';
    link.href = 'dark.css';
    document.head.appendChild(link);
  }
}
