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
      .filter((item) => this.instanceOfFormInputDataPipe.transform(item))
      .map((item: any) => {
        const formInput = item as FormInputData;
        if (
          formInput.data &&
          formInput.data.id &&
          formInput.customTitle &&
          formInput.customTitle.trim() !== '' &&
          formInput.type !== 'SectionComponent' &&
          formInput.type !== 'PictureInputComponent'
        ) {
          const variableType = this.getVariableType(formInput.type);
          if (variableType === null) {
            return null;
          }
          return {
            elementId: formInput.data!.id!,
            title: formInput.customTitle!,
            type: variableType,
          };
        }
        return null;
      });

    return list.filter((variable) => !!variable) as CodeEditorVariable[];
  }

  checkVariable(): void {
    const items = this.component$.value.map(c => c.data);
    this.validateVariablesRecursively(items);
  }

  private validateVariablesRecursively(items: (SectionList | FormInputData)[]): void {
    for (const item of items) {
      this.validateItemVariables(item);

      if (this.instanceOfSectionListPipe.transform(item)) {
        const section = item as SectionList;
        if (section.sectionInputs && section.sectionInputs.length > 0) {
          this.validateVariablesRecursively(section.sectionInputs);
        }
      }
    }
  }

  private validateItemVariables(item: SectionList | FormInputData): void {
    if (!item.codeEditor || !item.codeEditor.data || !item.codeEditor.data.variables) {
      return;
    }

    const targetId = this.instanceOfFormInputDataPipe.transform(item)
      ? (item as FormInputData).data?.id
      : (item as SectionList).sectionId;

    if (!targetId) return;

    item.codeEditor.data.variables = item.codeEditor.data.variables.filter((variable) => {
      const existsGlobally = !!this.getItemById(variable.elementId);
      const validItemsBefore = this.getItemsBeforeId(targetId);
      const isValidScope = validItemsBefore.some(i =>
        this.instanceOfFormInputDataPipe.transform(i) && (i as FormInputData).data?.id === variable.elementId
      );

      return existsGlobally && isValidScope;
    });
  }

  private findItemById(targetId: string, items: (SectionList | FormInputData)[]): SectionList | FormInputData | undefined {
    for (const item of items) {

      if (this.instanceOfSectionListPipe.transform(item)) {
        const section = item as SectionList;
        if (section.sectionId === targetId) {
          return item;
        }

        if (section.sectionInputs.length > 0) {
          const foundInSection = this.findItemById(targetId, section.sectionInputs);
          if (foundInSection) {
            return foundInSection;
          }
        }
      } else if (this.instanceOfFormInputDataPipe.transform(item)) {
        if ((item as FormInputData).data?.id === targetId) {
          return item;
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
      const isTargetFormInput = this.instanceOfFormInputDataPipe.transform(item) && (item as FormInputData).data?.id === targetId;
      const isTargetSection = this.instanceOfSectionListPipe.transform(item) && (item as SectionList).sectionId === targetId;

      if (isTargetFormInput || isTargetSection) {
        return { list: result, found: true };
      }

      if (this.instanceOfSectionListPipe.transform(item)) {
        const section = item as SectionList;
        result.push(item);

        if (section.sectionInputs && section.sectionInputs.length > 0) {
          const childFind = this.findItemsBeforeId(targetId, section.sectionInputs);
          result.push(...childFind.list);

          if (childFind.found) {
            return { list: result, found: true };
          }
        }
      } else if (this.instanceOfFormInputDataPipe.transform(item)) {
        result.push(item);
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
