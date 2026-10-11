import { TestBed } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';
import type { RouterStateSnapshot } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { TranslatedTitleStrategy } from './title-strategy';

describe('TranslatedTitleStrategy', () => {
  it('uses the translated route title once it becomes available', () => {
    const translated = new Subject<string>();
    const get = jasmine.createSpy('get').and.returnValue(translated);
    const setTitle = jasmine.createSpy('setTitle');
    TestBed.configureTestingModule({
      providers: [
        TranslatedTitleStrategy,
        { provide: Title, useValue: { setTitle } },
        { provide: TranslateService, useValue: { get } },
      ],
    });
    const strategy = TestBed.inject(TranslatedTitleStrategy);
    spyOn(strategy, 'buildTitle').and.returnValue('PAGE.TITLE');
    strategy.updateTitle({} as RouterStateSnapshot);
    expect(get).toHaveBeenCalledOnceWith('PAGE.TITLE');
    expect(setTitle).not.toHaveBeenCalled();
    translated.next('Questionnaires');
    translated.complete();
    expect(setTitle).toHaveBeenCalledOnceWith('Questionnaires');
  });
  
  it('leaves the document title unchanged when the route has no title', () => {
    const get = jasmine.createSpy('get');
    TestBed.configureTestingModule({
      providers: [TranslatedTitleStrategy, { provide: TranslateService, useValue: { get } }],
    });
    const strategy = TestBed.inject(TranslatedTitleStrategy);
    spyOn(strategy, 'buildTitle').and.returnValue(undefined);
    strategy.updateTitle({} as RouterStateSnapshot);
    expect(get).not.toHaveBeenCalled();
  });
});
