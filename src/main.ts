import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { bootstrapApplication } from '@angular/platform-browser';
import { version } from './version';
import { AppComponent } from '@app/app.component';
import { appConfig } from '@app/app.config';

console.log('App version:', version);

registerLocaleData(en);

bootstrapApplication(AppComponent, appConfig).catch((err) => console.error(err));
