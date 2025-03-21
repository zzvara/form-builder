import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { HeaderService } from '@services/header/header.service';
import { MenuOption } from '@models/menu-option.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
  standalone: false,
})
export class AppComponent implements OnInit, OnDestroy {
  activeOptions: MenuOption[] = [];
  optionsSub?: Subscription;
  options = MenuOption;

  title = 'form-builder';

  constructor(private readonly headerService: HeaderService) {}

  ngOnInit(): void {
    this.headerService.getOptions().subscribe((options) => (this.activeOptions = options.activeOptions));
  }

  ngOnDestroy(): void {
    this.optionsSub?.unsubscribe();
  }
}
