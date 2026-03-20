import { provideZoneChangeDetection } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from '@app/app.module';
import { version } from './version';

console.log('App version:', version);

platformBrowserDynamic()
  .bootstrapModule(AppModule, { applicationProviders: [provideZoneChangeDetection()] })
  .catch((err) => console.error(err));
