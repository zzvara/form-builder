import { Injectable, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { type RouterStateSnapshot, TitleStrategy } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class TranslatedTitleStrategy extends TitleStrategy {
  private readonly title = inject(Title);
  private translate = inject(TranslateService);

  override updateTitle(routerState: RouterStateSnapshot) {
    const titleKey = this.buildTitle(routerState);
    if (titleKey) {
      this.translate.get(titleKey).subscribe((translatedTitle) => {
        this.title.setTitle(translatedTitle);
      });
    }
  }
}
