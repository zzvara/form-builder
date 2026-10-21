import type { PipeTransform } from '@angular/core';
import { Pipe } from '@angular/core';
import type { FormInputData } from '../interfaces/form-input-data';

@Pipe({
  name: 'instanceOfFormInputData',
  standalone: true,
})
export class InstanceOfFormInputDataPipe implements PipeTransform {
  transform(object: unknown): object is FormInputData {
    return (
      typeof object === 'object' &&
      object !== null &&
      'title' in object &&
      'type' in object &&
      'data' in object
    );
  }
}
