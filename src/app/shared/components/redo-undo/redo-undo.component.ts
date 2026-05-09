import { Component, EventEmitter, Output } from '@angular/core';
import { UndoRedoEnum } from '@app/shared/interfaces/undo-redo-type.enum';
import { TranslatePipe } from '@ngx-translate/core';
import { SectionList } from '@pages/edit/interfaces/section-list';
import { UndoRedoService } from '@services/undo-redo.service';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTooltipModule } from 'ng-zorro-antd/tooltip';

@Component({
  selector: 'app-redo-undo',
  templateUrl: './redo-undo.component.html',
  styleUrls: [],
  standalone: true,
  imports: [NzTooltipModule, NzButtonComponent, NzIconModule, TranslatePipe],
})
export class RedoUndoComponent {
  @Output() sectionInputsChange = new EventEmitter<UndoRedoEnum>();

  constructor(private undoRedoService: UndoRedoService<SectionList[]>) {}

  get canUndo(): boolean {
    return this.undoRedoService.canUndo();
  }

  get canRedo(): boolean {
    return this.undoRedoService.canRedo();
  }

  undoBtn(): void {
    this.sectionInputsChange.emit(UndoRedoEnum.UNDO);
  }

  redoBtn(): void {
    this.sectionInputsChange.emit(UndoRedoEnum.REDO);
  }
}
