import { Component, EventEmitter, inject, Input, OnInit, Output, ViewChild } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Project, ProjectVersion } from '@interfaces/project';
import { EditComponent } from '@pages/edit/edit.component';
import { ProjectService } from '@services/project.service';
import { InlineEdit } from '@interfaces/inline-edit';
import { EditList } from '@pages/edit/interfaces/edit-list';
import { instanceOfSectionList } from '@pages/edit/interfaces/section-list';
import { instanceOfFormInputData } from '@interfaces/form-input-data';
import { cloneDeep } from 'lodash-es';
import { NzTreeNodeOptions } from 'ng-zorro-antd/tree';
import { NzFormatEmitEvent } from 'ng-zorro-antd/tree';

interface TreeNode {
  name: string;
  id: string;
  disabled?: boolean;
  children?: TreeNode[];
}

interface FlatNode {
  expandable: boolean;
  name: string;
  id: string;
  level: number;
  disabled: boolean;
}

@Component({
  selector: 'app-components-page',
  templateUrl: './components-page.component.html',
  styleUrls: ['./components-page.component.less'],
  standalone: false,
})
export class ComponentsPageComponent implements OnInit {
  private readonly projectService: ProjectService<Project> = inject(ProjectService);

  @ViewChild(EditComponent) editComponent!: EditComponent;

  @Input() projectId: string | undefined;
  @Input() page?: number;
  @Output() setPage = new EventEmitter<number>();
  @Output() versionChange = new EventEmitter<number>();

  inlineEdit: InlineEdit = { enabled: true };

  projectHistory: ProjectVersion<Project>[] = [];
  currentVersionNum?: number;

  usedComponents: { title: string; id: string; parentId?: string }[] = [];

  treeNodes: NzTreeNodeOptions[] = [];

  /**
   * If a projectId is defined, it fetches the project history and sets the current version number to the latest version.
   * Otherwise, it defaults the current version number to 1.
   * @returns {void}
   */
  ngOnInit(): void {
    if (this.projectId !== undefined) {
      this.projectHistory = this.projectService.getProjectHistory(this.projectId);
      this.currentVersionNum = this.projectHistory.length > 0 ? this.projectHistory[this.projectHistory.length - 1].versionNum : 1;
      this.versionChange.emit(this.currentVersionNum);
    }
  }

  /**
   * Saves the current form state by calling saveForm on the editComponent.
   * Then, it increments the page number and emits an event to notify parent components of the page change.
   */
  nextPage() {
    this.editComponent.saveForm();
    this.page! += 1;
    this.onsetPage(this.page!);
  }

  /**
   * Emits an event to set the current page in the parent component.
   * @param {number} page - The new page number to navigate to.
   * @returns {void}
   */
  onsetPage(page: number): void {
    this.setPage.emit(page);
  }

  /**
   * Checks if there is a previous version of the project available.
   * @returns {boolean} True if the current version number is greater than 1, indicating that previous versions exist.
   */
  hasPreviousVersion(): boolean {
    return this.currentVersionNum !== undefined && this.currentVersionNum > 1;
  }

  /**
   * Checks if there is a next version of the project available.
   * @returns {boolean} True if the current version number is not the latest, indicating that a next version exists.
   */
  hasNextVersion(): boolean {
    return this.currentVersionNum !== undefined && this.projectHistory.some((v) => v.versionNum === this.currentVersionNum! + 1);
  }

  /**
   * Navigates to a different version of the project based on the given offset.
   * @param {number} offset - The number to add to the current version number to navigate to the new version.
   * @returns {void}
   */
  navigateVersion(offset: number): void {
    if (this.currentVersionNum !== undefined) {
      const newVersionNum = this.currentVersionNum + offset;
      this.revertToVersion(newVersionNum);
    }
  }

  /**
   * Reverts the project to a specified version.
   * @param versionNum - The version number to revert the project to.
   * @returns {void}
   */
  revertToVersion(versionNum: number): void {
    if (this.projectId !== undefined) {
      const version = this.projectService.revertToVersion(this.projectId, versionNum);
      if (version) {
        this.currentVersionNum = versionNum;
        this.versionChange.emit(this.currentVersionNum);
        this.editComponent.ngOnInit();
      } else {
        console.error('Failed to revert to version', versionNum);
      }
    }
  }

  getTreeData(): TreeNode[] {
    const map = new Map<string, TreeNode>();
    const roots: TreeNode[] = [];

    for (const comp of this.usedComponents) {
      const node: TreeNode = { name: comp.title, id: comp.id, disabled: false };
      map.set(comp.id, node);

      if (comp.parentId) {
        const parent = map.get(comp.parentId);
        if (parent) {
          parent.children = parent.children || [];
          parent.children.push(node);
        }
      } else {
        roots.push(node);
      }
    }

    return roots;
  }

  onSectionInputsChange(undoRedoEvent: 'UNDO' | 'REDO'): void {
    this.editComponent.undoRedo(undoRedoEvent);
  }

  get isNextButtonDisabled(): boolean {
    return this.editComponent ? this.editComponent.isFormInvalid() : true;
  }

  onUsedComponentsChange(components: { title: string; id: string; parentId?: string }[]): void {
    this.usedComponents = components;
    this.treeNodes = this.buildTreeData();
  }

  buildTreeData(): NzTreeNodeOptions[] {
    const map = new Map<string, NzTreeNodeOptions>();
    const roots: NzTreeNodeOptions[] = [];

    const hasChild = (id: string): boolean => {
      return this.usedComponents.some((c) => c.parentId === id);
    };

    for (const comp of this.usedComponents) {
      const node: NzTreeNodeOptions = {
        title: comp.title,
        key: comp.id,
        children: [],
        isLeaf: !(comp.title === 'SECTION' && hasChild(comp.id)), // csak akkor nem levél, ha van gyereke
      };

      map.set(comp.id, node);

      if (comp.parentId) {
        const parent = map.get(comp.parentId);
        if (parent) {
          parent.children = parent.children || [];
          parent.children.push(node);
        }
      } else {
        roots.push(node);
      }
    }

    return roots;
  }

  onDrop(event: NzFormatEmitEvent): void {
    const dragNode = event.dragNode;
    const targetNode = event.node;
    const pos = (event as any).pos;

    if (!dragNode || !targetNode || pos === undefined) return;

    const dragged = this.usedComponents.find((c) => c.id === dragNode.key);
    const target = this.usedComponents.find((c) => c.id === targetNode.key);

    if (!dragged || !target) return;

    if (pos === 0) {
      dragged.parentId = target.id;
    } else {
      dragged.parentId = target.parentId;
    }

    this.treeNodes = this.buildTreeData();

    this.reorderEditListBasedOnUsedComponents();
  }

  reorderEditListBasedOnUsedComponents(): void {
    const idToComponent = new Map<string, any>();

    for (const comp of this.editComponent.editList) {
      idToComponent.set(comp.id, comp);
    }

    const buildTree = (parentId?: string): any[] => {
      return this.usedComponents
        .filter((c) => c.parentId === parentId)
        .map((c) => {
          const comp = idToComponent.get(c.id);
          if (comp) {
            comp.children = buildTree(c.id);
          }
          return comp;
        })
        .filter(Boolean);
    };

    this.editComponent.editList = buildTree(undefined);
  }
}
