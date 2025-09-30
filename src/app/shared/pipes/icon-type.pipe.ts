import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'iconType',
  standalone: true,
})
export class IconTypePipe implements PipeTransform {
  transform(type: string): string {
    if (!type) return '?';

    const lowerType = type.toLowerCase();

    if (lowerType.includes('number')) return '#';
    if (lowerType.includes('text')) return 'T';

    return '?';
  }
}
