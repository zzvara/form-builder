import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuOption } from '../../models/menu-option.model';
import { HeaderService } from '../../../services/header/header.service';
import { Subscription } from 'rxjs';
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  headerOptions: MenuOption[] = [];
  activeOptions: MenuOption[] = [];
  options = MenuOption;
  optionsSub?: Subscription;

  constructor(private readonly router: Router, private readonly headerService: HeaderService,  private readonly translate: TranslateService) {}

  ngOnInit(): void {
    this.optionsSub = this.headerService
      .getOptions()
      .subscribe((options) => ({ options: this.headerOptions, activeOptions: this.activeOptions } = options));
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

  ngOnDestroy(): void {
    this.optionsSub?.unsubscribe();
  }
  setLanguage(lang: string): void {
    this.translate.use(lang);
  }

}
