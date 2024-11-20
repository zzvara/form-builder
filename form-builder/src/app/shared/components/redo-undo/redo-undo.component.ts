import { moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SectionList } from 'src/app/pages/edit/interfaces/section-list';
import { UndoRedoService } from 'src/app/services/undo-redo.service';

@Component({
  selector: 'app-redo-undo',
  templateUrl: './redo-undo.component.html',
  styleUrls: ['./redo-undo.component.css'],
})
export class RedoUndoComponent {
  constructor(private undoRedoService: UndoRedoService<SectionList[]>) {}

  get canUndo(): boolean {
    return this.undoRedoService.canUndo();
  }

  get canRedo(): boolean {
    return this.undoRedoService.canRedo();
  }

  @Input() sectionInputs: SectionList[] = [];
  @Output() sectionInputsChange = new EventEmitter<SectionList[]>();

  undoBtn(): void {
    const previousState = this.undoRedoService.undo(this.sectionInputs);
    if (previousState) {
      this.sectionInputs = previousState;
      this.sectionInputsChange.emit(this.sectionInputs);
    }
  }

  redoBtn(): void {
    const nextState = this.undoRedoService.redo(this.sectionInputs);
    if (nextState) {
      this.sectionInputs = nextState;
      this.sectionInputsChange.emit(this.sectionInputs);
    }
  }
}
