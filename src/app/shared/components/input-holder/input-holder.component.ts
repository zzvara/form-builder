import { AbstractEditForm } from '@abstract-classes/abstract-edit-form';
import { AbstractInput } from '@abstract-classes/abstract-input';
import { NgComponentOutlet } from '@angular/common';
import { AfterViewInit, Component, DestroyRef, EventEmitter, Input, OnInit, Output, Type, ViewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgForm, NgModel } from '@angular/forms';
import { getInputGroups, translateComponentType } from '@pages/edit/config/edit-data-config';
import { FormComponentMarker } from '@interfaces/form-component-marker';
import { FormInputData } from '@interfaces/form-input-data';
import { InlineEdit } from '@interfaces/inline-edit';
import { InputData } from '@interfaces/input-data';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-input-holder',
  templateUrl: './input-holder.component.html',
  styleUrls: ['./input-holder.component.less'],
  standalone: false,
})
export class InputHolderComponent<T = any, D extends InputData<T> = InputData, E extends AbstractEditForm<T, D> = AbstractEditForm<T, D>>
  implements OnInit, AfterViewInit
{
  @Input() formInput!: FormInputData<D, T>;
  get inputData(): D {
    return this.formInput.data!;
  }

  @Output() changedEvent = new EventEmitter<D>();
  @Output() removeComponentEvent = new EventEmitter<string>();

  @ViewChild('inputHolderForm') form!: NgForm;
  @ViewChild('questionInput') questionInput!: NgModel;
  @ViewChild(NgComponentOutlet, { static: true }) inputOutlet!: NgComponentOutlet;

  @Input() inlineEdit: InlineEdit = { enabled: true };

  componentInputs!: {
    data: D;
    inlineEdit: InlineEdit;
  };

  constructor(
    private destroyRef: DestroyRef,
    private translate: TranslateService
  ) {}

  get componentType(): Type<FormComponentMarker> {
    return translateComponentType[this.formInput.type];
  }

  get embeddedComponent(): AbstractInput<T, D, E> {
    return this.inputOutlet['_componentRef']?.instance;
  }

  ngOnInit(): void {
    this.componentInputs = {
      data: this.inputData,
      inlineEdit: this.inlineEdit,
    };
  }

  ngAfterViewInit() {
    this.questionInput?.control?.markAsTouched();
    if (this.inputOutlet) {
      setTimeout(() => {
        if (this.embeddedComponent && this.embeddedComponent.edited) {
          this.embeddedComponent.edited.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((data: D) => {
            this.changedEvent.emit(data);
          });
        }
      });
    }
  }

  removeComponent() {
    this.removeComponentEvent.emit(this.inputData.id);
  }

  resetComponent() {
    const defaultData: FormInputData<D, T> | undefined = getInputGroups(this.translate).find((group) => group.type === this.formInput.type);
    if (defaultData) {
      Object.keys(this.inputData)
        .filter((key) => key !== 'id' && key !== 'sectionId')
        .forEach((key) => {
          this.inputData[key as keyof D] = defaultData.data![key as keyof D];
        });
      this.changedEvent.emit(this.inputData);
    }
  }

  editComponent() {
    if (this.embeddedComponent) {
      this.embeddedComponent.edit();
    }
  }

  change() {
    this.changedEvent.emit(this.inputData);
  }

  isValid() {
    return this.form?.valid ?? false;
  }

  isPristine() {
    return this.form?.pristine ?? true;
  }
}
