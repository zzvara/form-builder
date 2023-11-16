import { NgModule } from '@angular/core';
import { FormCreatorComponent } from './form-creator.component';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzTimePickerModule } from 'ng-zorro-antd/time-picker';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzStepsModule } from 'ng-zorro-antd/steps';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [FormCreatorComponent],
  imports: [NzFormModule, NzInputModule, NzLayoutModule, NzSwitchModule, NzDatePickerModule, NzTimePickerModule, NzCheckboxModule, NzStepsModule, NzButtonModule, FormsModule, ReactiveFormsModule],
  providers: [],
  exports: [],
})
export class FormCreatorModule {}
