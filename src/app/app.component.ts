import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/components/header/header.component';
import { NzLayoutComponent } from 'ng-zorro-antd/layout';
import { TranslateService } from '@ngx-translate/core';
import { NzI18nService, en_US, hu_HU } from 'ng-zorro-antd/i18n';
import { enUS as dateFnsEn, hu as dateFnsHu } from 'date-fns/locale';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, HeaderComponent, NzLayoutComponent],
})
export class AppComponent implements OnInit {
  private readonly translate = inject(TranslateService);
  private readonly nzI18nService = inject(NzI18nService);
  private readonly destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    const initialLang = this.translate.getCurrentLang() ?? this.translate.getFallbackLang() ?? 'en';
    this.updateNzLocale(initialLang);

    this.translate.onLangChange.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((event) => {
      this.updateNzLocale(event.lang);
    });
  }

  private updateNzLocale(lang: string): void {
    if (lang === 'hu') {
      this.nzI18nService.setLocale(hu_HU);
      this.nzI18nService.setDateLocale(dateFnsHu);
    } else {
      this.nzI18nService.setLocale(en_US);
      this.nzI18nService.setDateLocale(dateFnsEn);
    }
  }
}
