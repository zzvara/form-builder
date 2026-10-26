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

  it('publishes context actions and removes them when cleared', () => {
    const callback = jasmine.createSpy('callback');
    const action = { id: 'save', label: 'Save', type: 'primary' as const, callback };
    const emitted = jasmine.createSpy('emitted');
    const sub = service.getContextActions().subscribe(emitted);
    service.setContextActions([action]);
    expect(service.actions()).toEqual([action]);
    expect(emitted).toHaveBeenCalledWith([action]);
    service.actions()[0].callback();
    expect(callback).toHaveBeenCalled();
    service.setContextActions([]);
    expect(service.actions()).toEqual([]);
    sub.unsubscribe();
  });

  it('emits save and undo events independently', () => {
    const save = jasmine.createSpy('save');
    const undo = jasmine.createSpy('undo');
    const saveSub = service.onSave().subscribe(save);
    const undoSub = service.onUndo().subscribe(undo);
    service.triggerSave();
    expect(save).toHaveBeenCalledTimes(1);
    expect(undo).not.toHaveBeenCalled();
    service.triggerUndo();
    expect(undo).toHaveBeenCalledTimes(1);
    saveSub.unsubscribe();
    undoSub.unsubscribe();
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
