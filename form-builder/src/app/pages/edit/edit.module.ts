import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { EditComponent } from './edit.component';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzFormModule } from 'ng-zorro-antd/form';
import { DragDropModule } from '@angular/cdk/drag-drop';

@NgModule({
  declarations: [EditComponent],
  imports: [BrowserModule, NzLayoutModule, NzIconModule, NzFormModule, DragDropModule],
  providers: [],
  exports: [NzIconModule, EditComponent],
})
export class EditModule {}
