import type { OnDestroy, OnInit } from '@angular/core';
import { Component, inject } from '@angular/core';
import type { Subscription } from 'rxjs';
import type { HeaderService } from '@services/header/header.service';
import { MenuOption } from '@models/menu-option.model';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/components/header/header.component';
import { NzLayoutComponent } from 'ng-zorro-antd/layout';

/**
 * @todo It seems as if this component doesn't contain logic that's actually useful at this point in time.
 * It should be simplified. Details below.
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, NzLayoutComponent],
})
export class AppComponent implements OnInit, OnDestroy {
  private readonly headerService = inject(HeaderService);

  activeOptions: MenuOption[] = []; // @todo Unused variable. A value is given, but never used.
  optionsSub?: Subscription; // @todo Unused variable.
  options = MenuOption; // @todo Unused variable.

  title = 'form-builder';

  ngOnInit(): void {
    this.headerService
      .getOptions()
      .subscribe((options) => (this.activeOptions = options.activeOptions));
  }

  ngOnDestroy(): void {
    this.optionsSub?.unsubscribe(); // @todo Unnecessary lifecycle hook.
  }
}
