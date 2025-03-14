import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { en_US, NZ_I18N } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DashboardModule } from '@pages/dashboard/dashboard.module';
import { EditModule } from '@pages/edit/edit.module';
import { FormCreatorModule } from '@pages/form-creator/form-creator.module';
import { SharedModule } from '@shared/shared.module';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { HomeOutline, SettingOutline, AppstoreOutline, PlusOutline } from '@ant-design/icons-angular/icons';
import { IconDefinition } from '@ant-design/icons-angular';
import { NZ_ICONS } from 'ng-zorro-antd/icon';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';

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
