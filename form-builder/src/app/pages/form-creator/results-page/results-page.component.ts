import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-results-page',
  templateUrl: './results-page.component.html',
  styleUrls: ['./results-page.component.css']
})
export class ResultsPageComponent implements OnInit {

  @Input() page?: number;
  @Output() setPage = new EventEmitter<number>();
  @Input() projectId: number | undefined;

  ngOnInit(): void {
    console.log(this.projectId);
    
  }

  nextPage() {
    this.page! += 1;
    this.onsetPage(this.page!);
  }

  onsetPage(page: number): void {
    this.setPage.emit(page);
  }
}
