import { ChangeDetectionStrategy, Component, output } from '@angular/core';
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
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NzTooltipModule, NzButtonComponent, NzIconModule, TranslatePipe],
})
export class RedoUndoComponent {
  readonly sectionInputsChange = output<UndoRedoEnum>();

  constructor(private undoRedoService: UndoRedoService<SectionList[]>) {}

  readonly canUndo = this.undoRedoService.canUndoState;
  readonly canRedo = this.undoRedoService.canRedoState;

  undoBtn(): void {
    this.sectionInputsChange.emit(UndoRedoEnum.UNDO);
  }

  redoBtn(): void {
    this.sectionInputsChange.emit(UndoRedoEnum.REDO);
  }
}