import { Pipe, PipeTransform } from '@angular/core';
import { FormInputData } from '../interfaces/form-input-data';

@Pipe({
  name: 'instanceOfFormInputData',
  standalone: true,
})
export class InstanceOfFormInputDataPipe implements PipeTransform {
  transform(object: any): object is FormInputData {
    return object && 'title' in object && 'type' in object && 'data' in object;
  }
}
