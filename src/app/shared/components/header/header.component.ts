import type { OnDestroy, OnInit } from '@angular/core';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import type { ContextAction } from '@components/header/header.model';
import { MenuOption } from '@models/menu-option.model';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { HeaderService } from '@services/header/header.service';
import { JsonService } from '@services/json.service';
import { RoutePath } from '@app/shared/models/route-path.model';
import { LocalStorageKey } from '@app/shared/constants/localStorage.constant';
import { LanguageEnum } from '@app/shared/interfaces/language.enum';
import { ThemeEnum } from '@app/shared/enums/theme.enum';
import { EventService } from '@app/shared/services/event.service';
import { FormBuilderStore } from '@app/core/form-builder.store';
import { NzHeaderComponent } from 'ng-zorro-antd/layout';
import { CommonModule } from '@angular/common';
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
    NzButtonComponent,
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
  private readonly store = inject(FormBuilderStore);
  private readonly destroyRef = inject(DestroyRef);

  readonly menuState = this.headerService.options;
  readonly headerOptions = () => this.menuState().options;
  readonly activeOptions = () => this.menuState().activeOptions;
  readonly contextActions = this.headerService.actions;
  readonly currentLanguage = signal(LanguageEnum.EN);
  readonly currentTheme = signal(ThemeEnum.LIGHT);

  LanguageEnum = LanguageEnum;
  ThemeEnum = ThemeEnum;
  options = MenuOption;

  ngOnInit(): void {
    const savedLanguage = localStorage.getItem(LocalStorageKey.LANGUAGE);
    const language = savedLanguage === LanguageEnum.HU ? LanguageEnum.HU : LanguageEnum.EN;
    this.currentLanguage.set(language);
    this.translate.use(language);
    this.jsonService.clearJsonData();
    const savedTheme = localStorage.getItem(LocalStorageKey.THEME);
    const theme = savedTheme === ThemeEnum.DARK ? ThemeEnum.DARK : ThemeEnum.LIGHT;
    this.currentTheme.set(theme);
    if (theme === ThemeEnum.DARK) this.applyDarkThemeCss();
    this.eventService.themeChange.next(theme);
  }

  navigateToHome(): void {
    this.router.navigate([RoutePath.DASHBOARD]);
  }

  changeMenuItemState(toChange: MenuOption) {
    if (this.activeOptions().includes(toChange)) {
      this.headerService.setOptions(
        this.headerOptions(),
        this.activeOptions().filter((option) => option !== toChange),
      );
    } else {
      this.headerService.setOptions(this.headerOptions(), [...this.activeOptions(), toChange]);
    }
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
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((data) => {
        this.jsonService.setJsonData(data);
        this.store.initNewProject(data.project.type);
        this.store.updateProject(data.project);
        this.router.navigate([RoutePath.NEW], {
          queryParams: { type: data.project.type },
          state: { projectData: data },
        });
      });
  }

  ngOnDestroy(): void {
    this.jsonService.clearJsonData();
  }

  setLanguage(lang: LanguageEnum): void {
    this.currentLanguage.set(lang);
    this.translate.use(lang);
    localStorage.setItem(LocalStorageKey.LANGUAGE, lang);
  }

  setTheme(theme: ThemeEnum): void {
    localStorage.setItem(LocalStorageKey.THEME, theme);
    this.currentTheme.set(theme);

    const existingLink = document.getElementById('theme-link') as HTMLLinkElement | null;
    if (existingLink) {
      existingLink.parentNode?.removeChild(existingLink);
    }

    if (theme === ThemeEnum.DARK) {
      this.applyDarkThemeCss();
    }
    this.eventService.themeChange.next(theme);
  }

  private applyDarkThemeCss(): void {
    const link = document.createElement('link');
    link.id = 'theme-link';
    link.rel = 'stylesheet';
    link.href = 'dark.css';
    document.head.appendChild(link);
  }
}
