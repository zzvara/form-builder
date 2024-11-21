import {Component, EventEmitter, inject, Output} from '@angular/core';
import {SectionList} from 'src/app/pages/edit/interfaces/section-list';
import {UndoRedoService} from 'src/app/services/undo-redo.service';

@Component({
  selector: 'app-redo-undo',
  templateUrl: './redo-undo.component.html',
  styleUrls: ['./redo-undo.component.css'],
})
export class RedoUndoComponent {
  private readonly undoRedoService: UndoRedoService<SectionList[]> = inject(UndoRedoService);

  get canUndo(): boolean {
    return this.undoRedoService.canUndo();
  }

  get canRedo(): boolean {
    return this.undoRedoService.canRedo();
  }

  @Output() sectionInputsChange = new EventEmitter<"UNDO" | "REDO">();

  undoBtn(): void {
    this.sectionInputsChange.emit("UNDO");
  }

  redoBtn(): void {
    this.sectionInputsChange.emit("REDO");
  }
}
