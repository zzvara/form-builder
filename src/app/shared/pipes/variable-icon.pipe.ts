import { Pipe, PipeTransform } from '@angular/core';
import { CodeEditorVariableType } from '../enums/code-editor.enum';

@Pipe({
  name: 'variableIcon',
})
export class VariableIconPipe implements PipeTransform {
  transform(variableType: CodeEditorVariableType): string {
    switch (variableType) {
      case CodeEditorVariableType.NUMBER:
        return 'number';
      case CodeEditorVariableType.BOOLEAN:
        return 'bold';
      case CodeEditorVariableType.STRING:
      case CodeEditorVariableType.STRING_ARRAY:
        return 'font-size';
      case CodeEditorVariableType.DATE:
      case CodeEditorVariableType.DATE_ARRAY:
        return 'calendar';
      default:
        return 'question-circle';
    }
  }
}
