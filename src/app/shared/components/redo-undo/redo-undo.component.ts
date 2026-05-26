import { ChangeDetectionStrategy, Component, EventEmitter, Output, Signal } from '@angular/core';
import { UndoRedoEnum } from '@app/shared/interfaces/undo-redo-type.enum';
import { SectionList } from '@pages/edit/interfaces/section-list';
import { UndoRedoService } from '@services/undo-redo.service';

@Component({
  selector: 'app-redo-undo',
  templateUrl: './redo-undo.component.html',
  styleUrls: [],
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RedoUndoComponent {
  @Output() sectionInputsChange = new EventEmitter<UndoRedoEnum>();

  public readonly canUndo: Signal<boolean> = this.undoRedoService.canUndo;
  public readonly canRedo: Signal<boolean> = this.undoRedoService.canRedo;

  constructor(private undoRedoService: UndoRedoService<SectionList[]>) {}

  undoBtn(): void {
    this.sectionInputsChange.emit(UndoRedoEnum.UNDO);
  }

  redoBtn(): void {
    this.sectionInputsChange.emit(UndoRedoEnum.REDO);
  }
}
