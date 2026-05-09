import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { HttpBackend, provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter, TitleStrategy } from '@angular/router';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { MultiTranslateHttpLoader } from 'ngx-translate-multi-http-loader';
import { en_US, NZ_I18N } from 'ng-zorro-antd/i18n';
import { IconDefinition } from '@ant-design/icons-angular';
import {
  AppstoreOutline,
  HomeOutline,
  PlusOutline,
  SettingOutline,
} from '@ant-design/icons-angular/icons';
import { NZ_ICONS } from 'ng-zorro-antd/icon';
import { importProvidersFrom } from '@angular/core';
import { QuillModule } from 'ngx-quill';
import { NzModalModule } from 'ng-zorro-antd/modal';

import { appRoutes } from './app.routes';
import { TranslatedTitleStrategy } from './core/title-strategy';
import { InstanceOfFormInputDataPipe } from './shared/pipes/instance-of-form-input-data.pipe';
import { InstanceOfSectionListPipe } from './shared/pipes/instance-of-section-list.pipe';

const icons: IconDefinition[] = [HomeOutline, SettingOutline, AppstoreOutline, PlusOutline];

export function httpLoaderFactory(handler: HttpBackend): TranslateLoader {
  return new MultiTranslateHttpLoader(handler, [
    { prefix: './assets/i18n/', suffix: '/header.json' },
    { prefix: './assets/i18n/', suffix: '/dashboard.json' },
    { prefix: './assets/i18n/', suffix: '/form-creator/info.json' },
    { prefix: './assets/i18n/', suffix: '/form-creator/components.json' },
    { prefix: './assets/i18n/', suffix: '/form-creator/results.json' },
    { prefix: './assets/i18n/', suffix: '/form-creator/shared.json' },
    { prefix: './assets/i18n/', suffix: '/shared.json' },
  ]);
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection(),
    provideHttpClient(),
    provideAnimations(),
    provideRouter(appRoutes),
    { provide: NZ_I18N, useValue: en_US },
    { provide: NZ_ICONS, useValue: icons },
    { provide: TitleStrategy, useClass: TranslatedTitleStrategy },
    InstanceOfSectionListPipe,
    InstanceOfFormInputDataPipe,
    importProvidersFrom(
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: httpLoaderFactory,
          deps: [HttpBackend],
        },
      }),
      QuillModule.forRoot({
        theme: 'snow',
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
            [{ script: 'sub' }, { script: 'super' }],
            ['link', 'image', 'code-block'],
            ['clean'],
          ],
        },
      }),
      NzModalModule,
    ),
  ],
};
