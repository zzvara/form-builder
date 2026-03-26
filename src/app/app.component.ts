import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { RouterOutlet } from '@angular/router';

import { HeaderService } from '@services/header/header.service';
import { SharedModule } from '@shared/shared.module'; // Ez hozza be az app-header-t!

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
  standalone: true, // <--- 1. Standalone bekapcsolva
  imports: [RouterOutlet, SharedModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  private headerService = inject(HeaderService);

  public activeOptions = toSignal(
    this.headerService.getOptions().pipe(map(options => options.activeOptions)),
    { initialValue: [] }
  );
}
