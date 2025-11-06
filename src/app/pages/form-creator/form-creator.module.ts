import { NgModule } from '@angular/core';
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
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { TranslatePipe } from '@ngx-translate/core';
import { FormCreatorComponent } from '@pages/form-creator/form-creator.component';
import { InfoPageComponent } from '@pages/form-creator/info-page/info-page.component';
import { ComponentsPageComponent } from '@pages/form-creator/components-page/components-page.component';
import { ChangeSummaryComponent } from './components-page/change-summary/change-summary.component';
import { ResultsPageComponent } from '@pages/form-creator/results-page/results-page.component';
import { EditModule } from '@pages/edit/edit.module';
import { SharedModule } from '@shared/shared.module';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { CommonModule } from '@angular/common';
import { IconTypePipe } from '@app/shared/pipes/icon-type.pipe';
import { SafeHtmlPipe } from '@app/shared/pipes/safe-html.pipe';

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
    NzPopoverModule,
    NzIconModule,
    CommonModule,
    NzIconModule,
    NzDropDownModule,
    NzMenuModule,
    SharedModule,
    TranslatePipe,
    NzDescriptionsModule,
    ChangeSummaryComponent,
    IconTypePipe,
    SafeHtmlPipe,
  ],
  providers: [IconTypePipe],
  exports: [],
})
export class FormCreatorModule {}
