import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { en_US } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DashboardModule } from './pages/dashboard/dashboard.module';
import { EditModule } from './pages/edit/edit.module';
import { FormCreatorModule } from './pages/form-creator/form-creator.module';
import { InputComponent } from './shared/components/input/input.component';
import { TextareaComponent } from './shared/components/textarea/textarea.component';
import { SelectComponent } from './shared/components/select/select.component';
import { DatePickerComponent } from './shared/components/date-picker/date-picker.component';

registerLocaleData(en);

@NgModule({
  declarations: [AppComponent, InputComponent, TextareaComponent, SelectComponent, DatePickerComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    DashboardModule,
    EditModule,
    FormCreatorModule,
  ],
  providers: [{ provide: NZ_I18N, useValue: en_US }],
  bootstrap: [AppComponent],
})
export class AppModule {}
