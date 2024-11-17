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

  @Input() formInputs: any[] = [];
  @Output() formInputsChange = new EventEmitter<any[]>();

  undoBtn(): void {
    const previousState = this.undoRedoService.undo(this.formInputs);
    if (previousState) {
      this.formInputs = previousState;
      this.formInputsChange.emit(this.formInputs);
    }
  }

  redoBtn(): void {
    const nextState = this.undoRedoService.redo(this.formInputs);
    if (nextState) {
      this.formInputs = nextState;
      this.formInputsChange.emit(this.formInputs);
    }
  }
}
