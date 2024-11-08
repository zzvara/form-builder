import {DragDropModule} from '@angular/cdk/drag-drop';
import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {NzButtonModule} from "ng-zorro-antd/button";
import {NzCardModule} from "ng-zorro-antd/card";
import {NzWaveModule} from "ng-zorro-antd/core/wave";
import {NzFormModule} from 'ng-zorro-antd/form';
import {NzIconModule} from 'ng-zorro-antd/icon';
import {NzLayoutModule} from 'ng-zorro-antd/layout';
import {SectionComponent} from 'src/app/shared/components/section/section.component';
import {SharedModule} from 'src/app/shared/shared.module';
import {EditComponent} from './edit.component';

@NgModule({
  declarations: [EditComponent],
  imports: [
    BrowserModule,
    NzLayoutModule,
    NzIconModule,
    NzFormModule,
    DragDropModule,
    SharedModule,
    NzCardModule,
    NzButtonModule,
    NzWaveModule],
  providers: [SectionComponent],
  exports: [NzIconModule, EditComponent],
})
export class EditModule {}
