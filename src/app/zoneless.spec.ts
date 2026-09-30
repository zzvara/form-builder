import {
  ChangeDetectionStrategy,
  Component,
  provideZonelessChangeDetection,
  signal,
} from '@angular/core';
import { TestBed } from '@angular/core/testing';

declare const JSHINT: typeof import('jshint').JSHINT;

@Component({
  standalone: true,
  template: '{{ count() }}',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class SignalComponent {
  readonly count = signal(0);
}

describe('zoneless change detection', () => {
  it('loads the browser-ready JavaScript linter', () => {
    expect(JSHINT('const answer = 42;', { esnext: true })).toBeTrue();
  });

  it('renders signal updates without Zone.js', async () => {
    TestBed.configureTestingModule({
      imports: [SignalComponent],
      providers: [provideZonelessChangeDetection()],
    });
    const fixture = TestBed.createComponent(SignalComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toBe('0');

    fixture.componentInstance.count.set(1);
    await fixture.whenStable();
    expect(fixture.nativeElement.textContent).toBe('1');
  });
});
