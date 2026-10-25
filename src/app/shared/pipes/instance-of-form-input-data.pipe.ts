import type { PipeTransform } from '@angular/core';
import { Pipe } from '@angular/core';
import type { FormInputData } from '../interfaces/form-input-data';

@Pipe({
  name: 'instanceOfFormInputData',
  standalone: true,
})
export class InstanceOfFormInputDataPipe implements PipeTransform {
  transform(object: unknown): object is FormInputData {
    return this.isFormInputData(object);
  }

  private isFormInputData(value: unknown): value is FormInputData {
    return this.isRecord(value) && 'title' in value && 'type' in value && 'data' in value;
  }

  private isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
  }
}
