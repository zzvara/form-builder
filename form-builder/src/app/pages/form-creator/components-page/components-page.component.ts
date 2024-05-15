import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { EditComponent } from '../../edit/edit.component';

@Component({
  selector: 'app-components-page',
  templateUrl: './components-page.component.html',
  styleUrls: ['./components-page.component.css']
})
export class ComponentsPageComponent implements OnInit {
  @ViewChild(EditComponent) editComponent!: EditComponent;

  @Input() projectId: number | undefined;

  @Input() page?: number;
  @Output() setPage = new EventEmitter<number>();

  ngOnInit(): void {
  }

  nextPage() {
    this.editComponent.saveForm();
    this.page! += 1;
    this.onsetPage(this.page!);
  }

  onsetPage(page: number): void {
    this.setPage.emit(page);
  }
}
