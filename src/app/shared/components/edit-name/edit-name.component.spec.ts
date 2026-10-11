import { TestBed } from '@angular/core/testing';
import type { ComponentFixture } from '@angular/core/testing';
import { appConfig } from '@app/app.config';
import { inputFixture } from '@app/testing/fixtures';
import { EditNameComponent } from './edit-name.component';

describe('EditNameComponent', () => {
  let fixture: ComponentFixture<EditNameComponent>;
  let component: EditNameComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [EditNameComponent],
      providers: appConfig.providers,
    });
    fixture = TestBed.createComponent(EditNameComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('edit', inputFixture('question', { customTitle: 'oldName' }));
    fixture.detectChanges();
  });

  it('saves a valid name and emits exactly one update', () => {
    const updated = spyOn(component.updateName, 'emit');
    component.setEditMode(true);
    expect(component.form.value.name).toBe('oldName');
    component.form.controls['name'].setValue('newName');
    component.saveName();
    expect(component.editFormInput?.customTitle).toBe('newName');
    expect(component.isEditName()).toBeFalse();
    expect(updated).toHaveBeenCalledTimes(1);
  });

  it('keeps invalid names in edit mode and marks their control', () => {
    const updated = spyOn(component.updateName, 'emit');
    component.setEditMode(true);
    component.form.controls['name'].setValue('invalid-name');
    component.saveName();
    expect(component.isEditName()).toBeTrue();
    expect(component.form.controls['name'].touched).toBeTrue();
    expect(updated).not.toHaveBeenCalled();
  });

  it('revalidates when another component takes the chosen name', () => {
    component.setEditMode(true);
    component.form.controls['name'].setValue('newName');
    fixture.componentRef.setInput('names', ['newName']);
    fixture.detectChanges();
    expect(component.form.controls['name'].hasError('notUnique')).toBeTrue();
  });
  
  it('updates wrapped edit-list entries as well as plain inputs', () => {
    const data = inputFixture('wrapped');
    fixture.componentRef.setInput('edit', { id: 'wrapped', data });
    fixture.detectChanges();
    component.setEditMode(true);
    component.form.controls['name'].setValue('wrappedName');
    component.saveName();
    expect(data.customTitle).toBe('wrappedName');
  });
});
