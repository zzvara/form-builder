import { appConfig } from '@app/app.config';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResultsPageComponent } from '@pages/form-creator/results-page/results-page.component';

describe('InfoPageComponent', () => {
  let component: ResultsPageComponent;
  let fixture: ComponentFixture<ResultsPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ResultsPageComponent],
      providers: appConfig.providers,
    });
    fixture = TestBed.createComponent(ResultsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
