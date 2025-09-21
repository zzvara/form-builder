import { registerLocaleData } from '@angular/common';
import { HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import en from '@angular/common/locales/en';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IconDefinition } from '@ant-design/icons-angular';
import { AppstoreOutline, HomeOutline, PlusOutline, SettingOutline } from '@ant-design/icons-angular/icons';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
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

export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http);
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
        deps: [HttpClient],
      },
    }),
    NzCheckboxModule,
  ],
  providers: [{ provide: NZ_I18N, useValue: en_US }, provideHttpClient(withInterceptorsFromDi()), { provide: NZ_ICONS, useValue: icons }],
})
export class AppModule {}
