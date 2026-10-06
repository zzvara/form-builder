import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';
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
import { CommonModule } from '@angular/common';
import { NzDropdownModule } from 'ng-zorro-antd/dropdown';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMenuModule } from 'ng-zorro-antd/menu';

@Component({
  selector: 'app-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.less'],
  standalone: true,
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
  readonly menuState = this.headerService.options;
  readonly headerOptions = () => this.menuState().options;
  readonly activeOptions = () => this.menuState().activeOptions;
  readonly contextActions = this.headerService.actions;
  options = MenuOption;
  readonly currentLanguage = signal(LanguageEnum.EN);
  readonly currentTheme = signal(ThemeEnum.LIGHT);

  LanguageEnum = LanguageEnum;
  ThemeEnum = ThemeEnum;

  constructor(
    private readonly router: Router,
    private readonly headerService: HeaderService,
    private readonly jsonService: JsonService,
    private readonly translate: TranslateService,
    private readonly eventService: EventService,
  ) {}

  ngOnInit(): void {
    this.currentLanguage.set(
      localStorage.getItem(LocalStorageKey.LANGUAGE) &&
      localStorage.getItem(LocalStorageKey.LANGUAGE) === LanguageEnum.HU
        ? LanguageEnum.HU
        : LanguageEnum.EN,
    );
    this.translate.use(this.currentLanguage());
    this.jsonService.clearJsonData();
    this.currentTheme.set(
      localStorage.getItem(LocalStorageKey.THEME) &&
      localStorage.getItem(LocalStorageKey.THEME) === ThemeEnum.LIGHT
        ? ThemeEnum.LIGHT
        : ThemeEnum.DARK,
    );

    if (this.currentTheme() === ThemeEnum.DARK) {
      this.setTheme(ThemeEnum.DARK);
    }
    this.currentTheme.set(
      localStorage.getItem(LocalStorageKey.THEME) === ThemeEnum.DARK
        ? ThemeEnum.DARK
        : ThemeEnum.LIGHT,
    );
    if (this.currentTheme() === ThemeEnum.DARK) {
      this.setTheme(ThemeEnum.DARK);
    }
    this.eventService.themeChange.next(this.currentTheme());
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
      const file = input.files[0];
      this.uploadJson(file);
    }
  }

  uploadJson(file: File): void {
    this.jsonService.uploadJson(file).subscribe((data) => {
      this.jsonService.setJsonData(data);
      this.router.navigate([RoutePath.NEW], {
        queryParams: { type: data.type },
        state: { projectData: data },
      });
    });
  }

  ngOnDestroy(): void {
    this.jsonService.destroy();
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

    this.eventService.themeChange.next(theme);

    if (theme === ThemeEnum.DARK) {
      const link = document.createElement('link');
      link.id = 'theme-link';
      link.rel = 'stylesheet';
      link.href = 'dark.css';
      document.head.appendChild(link);
    } else {
      // back to light: ensure only default (light) styles are active
      // no extra CSS to add because light.css is already injected
    }
  }
}
