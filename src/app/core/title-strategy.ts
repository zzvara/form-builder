import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterStateSnapshot, TitleStrategy } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class TranslatedTitleStrategy extends TitleStrategy {
  constructor(private readonly title: Title, private translate: TranslateService) {
    super();
  }

  override updateTitle(routerState: RouterStateSnapshot) {
    const titleKey = this.buildTitle(routerState);
    if (titleKey) {
      this.translate.get(titleKey).subscribe((translatedTitle) => {
        this.title.setTitle(`${translatedTitle}`);
      });
    }
  }
}
