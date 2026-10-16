import { TestBed } from '@angular/core/testing';

import { HeaderService } from '@services/header/header.service';
import { MenuOption } from '@models/menu-option.model';

describe('HeaderService', () => {
  let service: HeaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HeaderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('updates signal state and preserves synchronous observable notifications', () => {
    const options = jasmine.createSpy('options');
    const subscription = service.getOptions().subscribe(options);
    service.setOptions([MenuOption.HOME], [MenuOption.HOME]);

    expect(service.options()).toEqual({
      options: [MenuOption.HOME],
      activeOptions: [MenuOption.HOME],
    });
    expect(options).toHaveBeenCalledTimes(2);
    subscription.unsubscribe();
  });
});
