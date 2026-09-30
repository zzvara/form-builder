/*
 * <<licensetext>>
 */

import { AbstractEditForm } from '@abstract-classes/abstract-edit-form';
import { AbstractInput } from '@abstract-classes/abstract-input';
import { CommonModule, NgComponentOutlet } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  TemplateRef,
  Type,
  computed,
  input,
  output,
  untracked,
  viewChild,
} from '@angular/core';
import { FormsModule, NgForm, NgModel } from '@angular/forms';
import { mutableSignal, touch } from '@helpers/signal-helper';
import { getInputGroups, translateComponentType } from '@pages/edit/config/edit-data-config';
import { FormComponentMarker } from '@interfaces/form-component-marker';
import { FormInputData } from '@interfaces/form-input-data';
import { InlineEdit } from '@interfaces/inline-edit';
import { InputData } from '@interfaces/input-data';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { NzCardComponent } from 'ng-zorro-antd/card';
import {
  NzFormControlComponent,
  NzFormItemComponent,
  NzFormLabelComponent,
} from 'ng-zorro-antd/form';
import { NzInputGroupComponent, NzInputModule } from 'ng-zorro-antd/input';
import { QuillEditorComponent } from 'ngx-quill';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTooltipModule } from 'ng-zorro-antd/tooltip';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSwitchModule } from 'ng-zorro-antd/switch';

@Component({
  selector: 'app-input-holder',
  templateUrl: './input-holder.component.html',
  styleUrls: ['./input-holder.component.less'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    FormsModule,
    NzCardComponent,
    NzFormLabelComponent,
    NzFormControlComponent,
    NzInputGroupComponent,
    NzFormItemComponent,
    QuillEditorComponent,
    NzIconModule,
    NzTooltipModule,
    NzPopconfirmModule,
    NzButtonModule,
    NzInputModule,
    NzSwitchModule,
    TranslatePipe,
  ],
})
export class InputHolderComponent<
  T = any,
  D extends InputData<T> = InputData,
  E extends AbstractEditForm<T, D> = AbstractEditForm<T, D>,
>
  implements AfterViewInit
{
  readonly formInput = input.required<FormInputData<D, T>>();

  /**
   * The current state of the edited form input. Its data is mutated in place (inline edit, edit modal, reset),
   * so it's exposed as a signal which can be notified about these mutations.
   */
  readonly formInputState = mutableSignal(this.formInput);
  readonly inputData = computed<D>(() => this.formInputState().data!, { equal: () => false });

  readonly customTitle = input<TemplateRef<unknown>>();
  readonly inlineEdit = input<InlineEdit>({ enabled: true });

  readonly changedEvent = output<D>();
  readonly removeComponentEvent = output<string>();

  private readonly form = viewChild<NgForm>('inputHolderForm');
  private readonly questionInput = viewChild<NgModel>('questionInput');
  private readonly inputOutlet = viewChild.required(NgComponentOutlet);

  readonly componentType = computed<Type<FormComponentMarker>>(
    () => translateComponentType[this.formInputState().type],
  );

  readonly componentInputs = computed(() => ({
    data: this.inputData(),
    inlineEdit: this.inlineEdit(),
  }));

  constructor(
    private destroyRef: DestroyRef,
    private translate: TranslateService,
  ) {}

  get embeddedComponent(): AbstractInput<T, D, E> | null {
    return this.inputOutlet().componentInstance as AbstractInput<T, D, E> | null;
  }

  ngAfterViewInit() {
    this.questionInput()?.control?.markAsTouched();
    const embeddedComponent = this.embeddedComponent;
    if (embeddedComponent && embeddedComponent.edited) {
      const subscription = embeddedComponent.edited.subscribe((data: D) => {
        this.onChanged(data);
      });
      this.destroyRef.onDestroy(() => subscription.unsubscribe());
    }
  }

  removeComponent() {
    this.removeComponentEvent.emit(untracked(this.inputData).id!);
  }

  resetComponent() {
    const formInput = untracked(this.formInputState);
    const defaultData: FormInputData<D, T> | undefined = getInputGroups(this.translate).find(
      (group) => group.type === formInput.type,
    );
    if (defaultData) {
      // A new data object is created, so the embedded input component receives the reset values as well
      const inputData = { ...formInput.data! };
      Object.keys(inputData)
        .filter((key) => key !== 'id' && key !== 'sectionId')
        .forEach((key) => {
          inputData[key as keyof D] = defaultData.data![key as keyof D];
        });
      formInput.data = inputData;
      this.onChanged(inputData);
    }
  }

  editComponent() {
    this.embeddedComponent?.edit();
  }

  change() {
    this.onChanged(untracked(this.inputData));
  }

  onDraftChange(value: boolean) {
    const inputData = untracked(this.inputData);
    inputData.draft = value;
    this.onChanged(inputData);
  }

  isValid() {
    return (this.form()?.valid ?? false) || this.inputData().draft;
  }

  isPristine() {
    return this.form()?.pristine ?? true;
  }

  private onChanged(data: D) {
    touch(this.formInputState);
    this.changedEvent.emit(data);
  }
}