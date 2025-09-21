import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { HeaderService } from '@services/header/header.service';
import { MenuOption } from '@models/menu-option.model';

/**
 * @todo It seems as if this component doesn't contain logic that's actually useful at this point in time.
 * It should be simplified. Details below.
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
  standalone: false,
})
export class AppComponent implements OnInit, OnDestroy {
  activeOptions: MenuOption[] = []; // @todo Unused variable. A value is given, but never used.
  optionsSub?: Subscription; // @todo Unused variable.
  options = MenuOption; // @todo Unused variable.

  title = 'form-builder'; // @todo Unused variable. The related test must be aligned after changing this.

  constructor(private readonly headerService: HeaderService) {}

  ngOnInit(): void {
    this.headerService.getOptions().subscribe((options) => (this.activeOptions = options.activeOptions));
  }

  ngOnDestroy(): void {
    this.optionsSub?.unsubscribe(); // @todo Unnecessary lifecycle hook.
  }
}
