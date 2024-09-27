import { CdkDragDrop, CdkDragEnd, CdkDragStart, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormInput } from 'src/app/items/project.interface';
import { UndoRedoService } from 'src/app/services/undo-redo.service';

interface Panel {
  active: boolean;
  name: string;
}

interface Panels {
  [key: string]: Panel;
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent {
  constructor(private undoRedoService: UndoRedoService<FormInput[]>) {}
  panels: Panels = {
    basic: {
      name: 'Basic inputs',
      active: true,
    },
    selector: {
      name: 'Selectors',
      active: true,
    },
  };
  @Input() formInputs: any[] = [];
  @Input() sectiondId!: string;
  @Output() formInputsChange = new EventEmitter<any[]>();

  onFormInputsChange(updatedFormInputs: any[]): void {
    this.formInputs = updatedFormInputs;
    this.formInputsChange.emit(this.formInputs);
  }
}
