import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { EditComponent } from './edit.component';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzFormModule } from 'ng-zorro-antd/form';
import { CdkDrag } from '@angular/cdk/drag-drop';

@NgModule({
  declarations: [EditComponent],
  imports: [BrowserModule, NzLayoutModule, NzIconModule, NzFormModule, CdkDrag],
  providers: [],
  exports: [],
})
export class EditModule {}
