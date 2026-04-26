import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterOutlet } from '@angular/router';

import { HeaderService } from '@services/header/header.service';
import { SharedModule } from '@shared/shared.module';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
  standalone: true,
  imports: [RouterOutlet, SharedModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  private readonly headerService = inject(HeaderService);

  constructor() {

    this.headerService.onSave()
      .pipe(takeUntilDestroyed())
      .subscribe(() => {

      });
  }
}
