import { Component, OnDestroy, OnInit } from '@angular/core';
import { MenuOption } from './shared/models/menu-option.model';
import { Subscription } from 'rxjs';
import { HeaderService } from './services/header/header.service';
import { VersionControlService } from './services/version-control/version-control.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  activeOptions: MenuOption[] = [];
  optionsSub?: Subscription;
  options = MenuOption;

  constructor(private readonly headerService: HeaderService, private readonly versionControl: VersionControlService) {}

  ngOnInit(): void {
    this.headerService.getOptions().subscribe((options) => (this.activeOptions = options.activeOptions));
  }

  ngOnDestroy(): void {
    this.optionsSub?.unsubscribe();
  }
}
