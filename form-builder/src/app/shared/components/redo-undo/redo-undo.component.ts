import {Component, EventEmitter, inject, Output} from '@angular/core';
import {SectionList} from '@pages/edit/interfaces/section-list';
import {UndoRedoService} from '@services/undo-redo.service';

@Component({
    selector: 'app-redo-undo',
    templateUrl: './redo-undo.component.html',
    styleUrls: ['./redo-undo.component.css'],
    standalone: false
})
export class RedoUndoComponent {
  private readonly undoRedoService: UndoRedoService<SectionList[]> = inject(UndoRedoService);

  get canUndo(): boolean {
    return this.undoRedoService.canUndo();
  }

  get canRedo(): boolean {
    return this.undoRedoService.canRedo();
  }

  @Output() sectionInputsChange = new EventEmitter<'UNDO' | 'REDO'>();

  undoBtn(): void {
    this.sectionInputsChange.emit('UNDO');
  }

  redoBtn(): void {
    this.sectionInputsChange.emit('REDO');
  }
}
