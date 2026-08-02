import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HeaderService } from '@services/header/header.service';
import {NzLayoutComponent} from "ng-zorro-antd/layout";
import {HeaderComponent} from "@components/header/header.component";
import {RouterOutlet} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
  standalone: true,
  imports: [
    NzLayoutComponent,
    HeaderComponent,
    RouterOutlet
  ],
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
