import { NgModule } from '@angular/core';
import { FormCreatorComponent } from './form-creator.component';
import { InfoPageComponent } from './info-page/info-page.component';
import { ComponentsPageComponent } from './components-page/components-page.component';
import { ResultsPageComponent } from './results-page/results-page.component';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzTimePickerModule } from 'ng-zorro-antd/time-picker';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzStepsModule } from 'ng-zorro-antd/steps';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { EditModule } from '../edit/edit.module';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzToolTipModule } from "ng-zorro-antd/tooltip";
import { SharedModule } from "../../shared/shared.module";

@NgModule({
  declarations: [FormCreatorComponent, InfoPageComponent, ComponentsPageComponent, ResultsPageComponent],
  imports: [
    NzFormModule,
    NzInputModule,
    NzLayoutModule,
    NzSwitchModule,
    NzDatePickerModule,
    NzTimePickerModule,
    NzCheckboxModule,
    NzStepsModule,
    NzButtonModule,
    NzTabsModule,
    NzPopconfirmModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    EditModule,
    NzButtonModule,
    NzSelectModule,
    NzToolTipModule,
    SharedModule,
  ],
  providers: [],
  exports: [],
})
export class FormCreatorModule {}
