import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'iconType',
  standalone: true,
})
export class IconTypePipe implements PipeTransform {
  transform(type: string): string {
    if (!type) {
      return 'question';
    }

    const lowerType = type.toLowerCase();

    if (lowerType.includes('number')) {
      return 'number';
    } else if (lowerType.includes('text')) {
      return 'bold';
    } else {
      return 'question';
    }
  }
}
