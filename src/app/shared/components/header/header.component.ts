import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ContextAction } from '@components/header/header.model';
import { MenuOption } from '@models/menu-option.model';
import { TranslateService } from '@ngx-translate/core';
import { HeaderService } from '@services/header/header.service';
import { JsonService } from '@services/json.service';
import { Subscription } from 'rxjs';
import { RoutePath } from '@app/shared/models/route-path.model';
import { LocalStorageKey } from '@app/shared/constants/localStorage.constant';
import { LanguageEnum } from '@app/shared/interfaces/language.enum';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.less'],
  standalone: false,
})
export class HeaderComponent implements OnInit, OnDestroy {
  headerOptions: MenuOption[] = [];
  activeOptions: MenuOption[] = [];
  contextActions: ContextAction[] = [];
  options = MenuOption;
  currentLanguage: LanguageEnum = LanguageEnum.EN;
  private optionsSub?: Subscription;
  private actionsSub?: Subscription;

  LanguageEnum = LanguageEnum;

  constructor(
    private readonly router: Router,
    private readonly headerService: HeaderService,
    private readonly jsonService: JsonService,
    private readonly translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.currentLanguage =
      localStorage.getItem(LocalStorageKey.LANGUAGE) && localStorage.getItem(LocalStorageKey.LANGUAGE) === LanguageEnum.HU
        ? LanguageEnum.HU
        : LanguageEnum.EN;
    this.translate.use(this.currentLanguage);
    this.jsonService.clearJsonData();
    this.optionsSub = this.headerService
      .getOptions()
      .subscribe((options) => ({ options: this.headerOptions, activeOptions: this.activeOptions } = options));

    this.actionsSub = this.headerService.getContextActions().subscribe((actions) => (this.contextActions = actions));
  }

  navigateToHome(): void {
    this.router.navigate([RoutePath.DASHBOARD]);
  }

  changeMenuItemState(toChange: MenuOption) {
    if (this.activeOptions.includes(toChange)) {
      this.headerService.setOptions(
        this.headerOptions,
        this.activeOptions.filter((option) => option !== toChange)
      );
    } else {
      this.headerService.setOptions(this.headerOptions, [...this.activeOptions, toChange]);
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

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
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
    this.optionsSub?.unsubscribe();
    this.actionsSub?.unsubscribe();
    this.jsonService.destroy();
  }

  setLanguage(lang: LanguageEnum): void {
    this.currentLanguage = lang;
    this.translate.use(lang);
    localStorage.setItem(LocalStorageKey.LANGUAGE, lang);
  }
}
