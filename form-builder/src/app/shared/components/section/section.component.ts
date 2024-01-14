import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-section',
  templateUrl: './section.component.html',
  styleUrls: ['./section.component.css'],
})
export class SectionComponent {
  randomIntFromInterval(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
  @Input() sectiondId: string = `section${this.randomIntFromInterval(1, 100)}`;
  @Input() sectionList: string[] = ['buildedForm'];

  ngOnInit() {
    this.sectionList.push(this.sectiondId);
    console.log({ lis: this.sectionList, id: this.sectiondId });
    JSON.stringify(this.sectiondId);
  }
}
