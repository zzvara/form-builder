import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ContextAction } from '@components/header/header.model';
import { MenuOption } from '@models/menu-option.model';
import { TranslateService } from '@ngx-translate/core';
import { HeaderService } from '@services/header/header.service';
import { JsonService } from '@services/json.service';
import { Subscription } from 'rxjs';
import { NzButtonModule } from 'ng-zorro-antd/button';

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
  currentLanguage: string = 'en';
  private optionsSub?: Subscription;
  private actionsSub?: Subscription;

  constructor(
    private readonly router: Router,
    private readonly headerService: HeaderService,
    private readonly jsonService: JsonService,
    private readonly translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.currentLanguage = localStorage.getItem('language') || 'en';
    this.translate.use(this.currentLanguage);
    this.jsonService.clearJsonData();
    this.optionsSub = this.headerService
      .getOptions()
      .subscribe((options) => ({ options: this.headerOptions, activeOptions: this.activeOptions } = options));

    this.actionsSub = this.headerService.getContextActions().subscribe((actions) => (this.contextActions = actions));
  }

  navigateToHome(): void {
    this.router.navigate(['dashboard']);
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

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) {
      return;
    }
    const file = input.files[0];
    this.uploadJson(file);
  }

  uploadJson(file: File): void {
    this.jsonService.uploadJson(file).subscribe((data) => {
      this.jsonService.setJsonData(data);
      this.router.navigate(['new'], {
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

  setLanguage(lang: string): void {
    this.currentLanguage = lang;
    this.translate.use(lang);
    localStorage.setItem('language', lang);
  }
}
