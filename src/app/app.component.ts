import { Component, ChangeDetectionStrategy } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HeaderService } from '@services/header/header.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  constructor(private headerService: HeaderService) {

    this.headerService.onSave()
      .pipe(takeUntilDestroyed())
      .subscribe(() => {

      });
  }
}
