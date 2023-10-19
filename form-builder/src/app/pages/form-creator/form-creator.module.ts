import { NgModule } from '@angular/core';
import { FormCreatorComponent } from './form-creator.component';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [FormCreatorComponent],
  imports: [NzFormModule, NzInputModule, FormsModule, ReactiveFormsModule],
  providers: [],
  exports: [],
})
export class FormCreatorModule {}