import { Component, EventEmitter, Output } from '@angular/core';
import { UndoRedoEnum } from '@app/shared/interfaces/undo-redo-type.enum';
import { SectionList } from '@pages/edit/interfaces/section-list';
import { UndoRedoService } from '@services/undo-redo.service';

@Component({
  selector: 'app-redo-undo',
  templateUrl: './redo-undo.component.html',
  styleUrls: [],
  standalone: false,
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
