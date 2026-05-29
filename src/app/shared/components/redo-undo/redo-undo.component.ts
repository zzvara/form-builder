import { ChangeDetectionStrategy, Component, EventEmitter, Output, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UndoRedoEnum } from '@app/shared/interfaces/undo-redo-type.enum';
import { TranslatePipe } from '@ngx-translate/core';
import { EditList } from '@pages/edit/interfaces/edit-list';
import { FormBuilderStore } from '@app/core/form-builder.store';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTooltipModule } from 'ng-zorro-antd/tooltip';

@Component({
  selector: 'app-redo-undo',
  templateUrl: './redo-undo.component.html',
  styleUrls: [],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, NzTooltipModule, NzButtonComponent, NzIconModule, TranslatePipe],
})
export class RedoUndoComponent {
  @Output() sectionInputsChange = new EventEmitter<UndoRedoEnum>();

  public readonly canUndo: Signal<boolean> = this.store.canUndo;
  public readonly canRedo: Signal<boolean> = this.store.canRedo;

  constructor(public store: FormBuilderStore) {}

  undoBtn(): void {
    this.sectionInputsChange.emit(UndoRedoEnum.UNDO);
  }

  redoBtn(): void {
    this.sectionInputsChange.emit(UndoRedoEnum.REDO);
  }
}
