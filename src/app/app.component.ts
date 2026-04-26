import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HeaderService } from '@services/header/header.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
  standalone: true,
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
