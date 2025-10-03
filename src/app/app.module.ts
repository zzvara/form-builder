import { registerLocaleData } from '@angular/common';
import { HttpBackend, HttpClientModule } from '@angular/common/http';
import en from '@angular/common/locales/en';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IconDefinition } from '@ant-design/icons-angular';
import { AppstoreOutline, HomeOutline, PlusOutline, SettingOutline } from '@ant-design/icons-angular/icons';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { MultiTranslateHttpLoader } from 'ngx-translate-multi-http-loader';
import { DashboardModule } from '@pages/dashboard/dashboard.module';
import { EditModule } from '@pages/edit/edit.module';
import { FormCreatorModule } from '@pages/form-creator/form-creator.module';
import { SharedModule } from '@shared/shared.module';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { en_US, NZ_I18N } from 'ng-zorro-antd/i18n';
import { NZ_ICONS } from 'ng-zorro-antd/icon';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzIconModule } from 'ng-zorro-antd/icon';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

const icons: IconDefinition[] = [HomeOutline, SettingOutline, AppstoreOutline, PlusOutline];

registerLocaleData(en);

export function HttpLoaderFactory(handler: HttpBackend): TranslateLoader {
  return new MultiTranslateHttpLoader(handler, [
    { prefix: './assets/i18n/', suffix: '/general.json' },
    { prefix: './assets/i18n/', suffix: '/test.json' },
  ]);
}

@NgModule({
  declarations: [AppComponent],
  bootstrap: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    DashboardModule,
    EditModule,
    SharedModule,
    FormCreatorModule,
    NzToolTipModule,
    NzIconModule,
    NzPopoverModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpBackend],
      },
    }),
    NzCheckboxModule,
  ],
  providers: [
    { provide: NZ_I18N, useValue: en_US },
    { provide: NZ_ICONS, useValue: icons },
  ],
})
export class AppModule {}
