import { Injectable } from '@angular/core';
import { EditList } from '@app/pages/edit/interfaces/edit-list';
import { BehaviorSubject } from 'rxjs';
import { InstanceOfSectionListPipe } from '../pipes/instance-of-section-list.pipe';
import { SectionList } from '@app/pages/edit/interfaces/section-list';
import { FormInputData } from '../interfaces/form-input-data';
import { InstanceOfFormInputDataPipe } from '../pipes/instance-of-form-input-data.pipe';
import { CodeEditorVariable } from '../interfaces/code-editor.interface';
import { CodeEditorVariableType } from '../enums/code-editor.enum';
import { translateComponentType } from '@app/pages/edit/config/edit-data-config';

@Injectable({
  providedIn: 'root',
})
export class ComponentService {
  component$: BehaviorSubject<EditList[]> = new BehaviorSubject([] as EditList[]);

  // @Todo: The logic related to components and stages will need to be outsourced to this service later.

  constructor(
    private instanceOfSectionListPipe: InstanceOfSectionListPipe,
    private instanceOfFormInputDataPipe: InstanceOfFormInputDataPipe
  ) {
    this.component$.subscribe(() => {
      this.checkVariable();
    });
  }

  getItemById(targetId: string): SectionList | FormInputData | undefined {
    const items = this.component$.value.map((item) => item.data);
    return this.findItemById(targetId, items);
  }

  getItemsBeforeId(targetId: string): (SectionList | FormInputData)[] {
    const items = this.component$.value.map((item) => item.data);
    return items.length > 0 ? this.findItemsBeforeId(targetId, items).list : [];
  }

  getVariableList(targetId: string): CodeEditorVariable[] {
    this.checkVariable();
    const list = this.getItemsBeforeId(targetId)
      .filter(this.instanceOfFormInputDataPipe.transform)
      .map((item: FormInputData) => {
        if (
          item.data &&
          item.data.id &&
          item.customTitle &&
          item.customTitle.trim() !== '' &&
          item.type !== 'SectionComponent' &&
          item.type !== 'PictureInputComponent'
        ) {
          const variableType = this.getVariableType(item.type);
          if (variableType === null) {
            return null;
          }
          return {
            elementId: item.data!.id!,
            title: item.customTitle!,
            type: variableType,
          };
        }
        return null;
      });

    return list.filter((variable) => !!variable);
  }

  checkVariable(): void {
    const components = this.component$.value;
    components.forEach((component, componentIndex) => {
      const item = component.data;

      if (!item.codeEditor || !item.codeEditor.data || !item.codeEditor.data.variables) {
        return;
      }

      item.codeEditor.data.variables = item.codeEditor.data.variables.filter(
        (variable) => this.getItemById(variable.elementId) && this.isVariableValid(variable.elementId, componentIndex, components)
      );
    });
  }

  private isVariableValid(variableElementId: string, currentIndex: number, components: EditList[]): boolean {
    const index = components.findIndex((c) => c.data && c.data.data && c.data.data.id === variableElementId);
    return index !== -1 && index < currentIndex;
  }

  private findItemById(targetId: string, items: (SectionList | FormInputData)[]): SectionList | FormInputData | undefined {
    for (const item of items) {
      if (this.instanceOfFormInputDataPipe.transform(item)) {
        if (item.data?.id === targetId) {
          return item;
        }
      } else if (this.instanceOfSectionListPipe.transform(item)) {
        if (item.sectionId === targetId) {
          return item;
        }

        if (item.sectionInputs.length > 0) {
          const foundInSection = this.findItemById(targetId, item.sectionInputs);
          if (foundInSection) {
            return foundInSection;
          }
        }
      }
    }

    return undefined;
  }

  private findItemsBeforeId(
    targetId: string,
    items: (SectionList | FormInputData)[]
  ): { list: (SectionList | FormInputData)[]; found: boolean } {
    const result: (SectionList | FormInputData)[] = [];

    for (const item of items) {
      if (this.instanceOfFormInputDataPipe.transform(item)) {
        if (item.data?.id === targetId) {
          return { list: result, found: true };
        }
        result.push(item);
      } else if (this.instanceOfSectionListPipe.transform(item)) {
        if (item.sectionId === targetId || item.data.id === targetId || item.data.sectionId === targetId) {
          return { list: result, found: true };
        }

        result.push(item);

        if (item.sectionInputs.length > 0) {
          const childFind = this.findItemsBeforeId(targetId, item.sectionInputs);
          result.push(...childFind.list);
          if (childFind.found) {
            return { list: result, found: true };
          }
        }
      }
    }

    return { list: result, found: false };
  }

  private getVariableType(itemType: keyof typeof translateComponentType): CodeEditorVariableType | null {
    switch (itemType) {
      case 'CheckboxGroupComponent':
      case 'SelectComponent':
        return CodeEditorVariableType.STRING_ARRAY;
      case 'DatePickerComponent':
      case 'TimePickerComponent':
        return CodeEditorVariableType.DATE;
      case 'InputComponent':
      case 'TextareaComponent':
      case 'RadioGroupComponent':
        return CodeEditorVariableType.STRING;
      case 'NumberInputComponent':
        return CodeEditorVariableType.NUMBER;
      case 'RangePickerComponent':
        return CodeEditorVariableType.DATE_ARRAY;
      default:
        return null;
    }
  }
}
