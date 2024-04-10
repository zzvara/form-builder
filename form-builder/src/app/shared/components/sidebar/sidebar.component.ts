import { CdkDragDrop, CdkDragEnd, CdkDragStart, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, Input } from '@angular/core';
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
  constructor(private undeoRedoService: UndoRedoService) {}
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
}
