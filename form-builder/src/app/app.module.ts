import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {en_US, NZ_I18N} from 'ng-zorro-antd/i18n';
import {registerLocaleData} from '@angular/common';
import en from '@angular/common/locales/en';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {DashboardModule} from './pages/dashboard/dashboard.module';
import {EditModule} from './pages/edit/edit.module';
import {FormCreatorModule} from './pages/form-creator/form-creator.module';
import {SharedModule} from './shared/shared.module';
import {NzCheckboxModule} from 'ng-zorro-antd/checkbox';

registerLocaleData(en);

@NgModule({ declarations: [AppComponent],
    bootstrap: [AppComponent], imports: [BrowserModule,
        AppRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        DashboardModule,
        EditModule,
        SharedModule,
        FormCreatorModule,
        NzCheckboxModule], providers: [{ provide: NZ_I18N, useValue: en_US }, provideHttpClient(withInterceptorsFromDi())] })
export class AppModule {}
