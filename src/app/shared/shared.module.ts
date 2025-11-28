//Imports from packages
import { CdkDrag, CdkDropList, DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { CheckboxGroupEditComponent } from '@components/checkbox-group/checkbox-group-edit/checkbox-group-edit.component';
import { CheckboxGroupComponent } from '@components/checkbox-group/checkbox-group.component';
import { DatePickerEditComponent } from '@components/date-picker/date-picker-edit/date-picker-edit.component';

//Components
import { DatePickerComponent } from '@components/date-picker/date-picker.component';
import { HeaderComponent } from '@components/header/header.component';
import { InputHolderComponent } from '@components/input-holder/input-holder.component';
import { InputEditComponent } from '@components/input/input-edit/input-edit.component';
import { InputComponent } from '@components/input/input.component';
import { NumberInputEditComponent } from '@components/number-input/number-input-edit/number-input-edit.component';
import { NumberInputComponent } from '@components/number-input/number-input.component';
import { PictureInputEditComponent } from '@components/picture-input/picture-input-edit/picture-input-edit.component';
import { PictureInputComponent } from '@components/picture-input/picture-input.component';
import { RadioGroupEditComponent } from '@components/radio-group/radio-group-edit/radio-group-edit.component';
import { RadioGroupComponent } from '@components/radio-group/radio-group.component';
import { RangePickerEditComponent } from '@components/range-picker/range-picker-edit/range-picker-edit.component';
import { RangePickerComponent } from '@components/range-picker/range-picker.component';
import { RedoUndoComponent } from '@components/redo-undo/redo-undo.component';
import { SectionComponent } from '@components/section/section.component';
import { RepeatedSectionComponent } from './components/repeated-section/repeated-section.component';
import { SelectEditComponent } from '@components/select/select-edit/select-edit.component';
import { SelectComponent } from '@components/select/select.component';
import { SidebarComponent } from '@components/sidebar/sidebar.component';
import { TextareaEditComponent } from '@components/textarea/textarea-edit/textarea-edit.component';
import { TextareaComponent } from '@components/textarea/textarea.component';
import { TimePickerEditComponent } from '@components/time-picker/time-picker-edit/time-picker-edit.component';
import { TimePickerComponent } from '@components/time-picker/time-picker.component';
import { MutateTextDirective } from '@directives/mutate-text.directive';
import { TranslatePipe } from '@ngx-translate/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzDropdownMenuComponent, NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzMenuDirective, NzMenuItemComponent, NzMenuModule, NzSubMenuComponent } from 'ng-zorro-antd/menu';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzRadioGroupComponent, NzRadioModule } from 'ng-zorro-antd/radio';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTimePickerModule } from 'ng-zorro-antd/time-picker';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzTypographyComponent } from 'ng-zorro-antd/typography';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzDividerModule } from 'ng-zorro-antd/divider';

const COMPONENTS = [
  DatePickerComponent,
  InputComponent,
  SelectComponent,
  TextareaComponent,
  HeaderComponent,
  SidebarComponent,
  SectionComponent,
  RepeatedSectionComponent,
  RedoUndoComponent,
  PictureInputComponent,
  NumberInputComponent,
  SelectEditComponent,
  MutateTextDirective,
  InputHolderComponent,
  InputEditComponent,
  TextareaEditComponent,
  PictureInputEditComponent,
  NumberInputEditComponent,
  DatePickerEditComponent,
  RangePickerComponent,
  RangePickerEditComponent,
  TimePickerComponent,
  TimePickerEditComponent,
  RadioGroupComponent,
  RadioGroupEditComponent,
  CheckboxGroupComponent,
  CheckboxGroupEditComponent,
];

@NgModule({
  declarations: [...COMPONENTS],
  imports: [
    NzInputNumberModule,
    NzUploadModule,
    NzCardModule,
    BrowserModule,
    CommonModule,
    NzDatePickerModule,
    NzInputModule,
    NzDividerModule,
    NzSelectModule,
    FormsModule,
    NzLayoutModule,
    NzIconModule,
    NzCollapseModule,
    CdkDrag,
    CdkDropList,
    DragDropModule,
    NzButtonModule,
    NzModalModule,
    NzCheckboxModule,
    NzListModule,
    ReactiveFormsModule,
    NzFormModule,
    NzToolTipModule,
    NzTimePickerModule,
    NzPopconfirmModule,
    NzRadioGroupComponent,
    NzRadioModule,
    NzTableModule,
    NzMenuDirective,
    NzMenuItemComponent,
    NzSubMenuComponent,
    NzTypographyComponent,
    TranslatePipe,
    NzDropdownMenuComponent,
    NzMenuModule,
    NzDropDownModule,
  ],
  providers: [],
  exports: [...COMPONENTS],
})
export class SharedModule {}
