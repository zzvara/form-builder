import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot } from '@angular/router';
import type { RouterStateSnapshot } from '@angular/router';
import { headerResolver } from './header.resolver';
import { HeaderService } from '@services/header/header.service';
import { MenuOption } from '@models/menu-option.model';

describe('headerResolver', () => {
  for (const path of ['edit', 'new', 'form/edit']) {
    it(`selects editor actions for ${path}`, () => {
      const route = new ActivatedRouteSnapshot();
      Object.assign(route, { routeConfig: { path } });
      const result = TestBed.runInInjectionContext(() =>
        headerResolver(route, {} as RouterStateSnapshot),
      );
      expect(result).toBeNull();
      expect(TestBed.inject(HeaderService).options().options).toEqual([
        MenuOption.HOME,
        MenuOption.SETTINGS,
      ]);
    });
  }
  
  it('falls back to dashboard actions for unknown routes', () => {
    TestBed.runInInjectionContext(() =>
      headerResolver(new ActivatedRouteSnapshot(), {} as RouterStateSnapshot),
    );
    expect(TestBed.inject(HeaderService).options().options).toEqual([
      MenuOption.UPLOAD_JSON,
      MenuOption.SETTINGS,
    ]);
  });
});
