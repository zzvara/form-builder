import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { HeaderService } from '@services/header/header.service';
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
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, HeaderComponent, NzLayoutComponent],
})
export class AppComponent {
  readonly activeOptions = computed<MenuOption[]>(() => this.headerService.activeOptions()); // @todo Unused variable. A value is given, but never used.
  options = MenuOption; // @todo Unused variable.

  title = 'form-builder'; // @todo Unused variable. The related test must be aligned after changing this.

  constructor(private readonly headerService: HeaderService) {}
}