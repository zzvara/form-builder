import { TestBed } from '@angular/core/testing';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { VariableModalComponent } from './variable-modal.component';
import { CodeEditorVariableType as T } from '@app/shared/enums/code-editor.enum';

describe('VariableModalComponent', () => {
  const first = { elementId: 'first', title: 'firstAnswer', type: T.STRING };
  const second = { elementId: 'second', title: 'secondAnswer', type: T.NUMBER };
  let close: jasmine.Spy;
  let component: VariableModalComponent;

  beforeEach(() => {
    close = jasmine.createSpy('close');
    TestBed.configureTestingModule({
      providers: [
        { provide: NzModalRef, useValue: { close } },
        {
          provide: NZ_MODAL_DATA,
          useValue: { selectedVariables: [first], allVariables: [first, second] },
        },
      ],
    });
    component = TestBed.runInInjectionContext(() => new VariableModalComponent());
  });

  it('puts selected variables on the right and unselected variables on the left', () => {
    expect(component.allVariables.map((item) => [item['key'], item.direction])).toEqual([
      ['first', 'right'],
      ['second', 'left'],
    ]);
  });

  it('adds and removes selections without mutating the injected array', () => {
    component.onChange({ from: 'left', to: 'right', list: [component.allVariables[1]] });
    component.onChange({ from: 'right', to: 'left', list: [component.allVariables[0]] });
    component.saveModal();
    expect(close).toHaveBeenCalledOnceWith([second]);
    expect(component.data.selectedVariables).toEqual([first]);
  });

  it('closes without saving on cancel', () => {
    component.closeModal();
    expect(close).toHaveBeenCalledOnceWith();
  });
});
