import { TestBed } from '@angular/core/testing';
import { SecurityContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SafeHtmlPipe } from './safe-html.pipe';

describe('SafeHtmlPipe', () => {
  it('marks the supplied markup as trusted HTML', () => {
    const pipe = TestBed.runInInjectionContext(() => new SafeHtmlPipe());
    const html = '<strong>Question</strong>';
    expect(TestBed.inject(DomSanitizer).sanitize(SecurityContext.HTML, pipe.transform(html))).toBe(
      html,
    );
  });
});
