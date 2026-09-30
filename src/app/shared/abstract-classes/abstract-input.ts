import { AbstractEditForm } from '@abstract-classes/abstract-edit-form';
import { Directive, OnInit, TemplateRef, input, output, untracked } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ModalServiceService } from '@services/modal/modal-service.service';
import { FormComponentMarker } from '@interfaces/form-component-marker';
import { InlineEdit } from '@interfaces/inline-edit';
import { InputData } from '@interfaces/input-data';
import { mutableSignal, touch } from '@helpers/signal-helper';

@Directive()
export abstract class AbstractInput<T, D extends InputData<T>, E extends AbstractEditForm<T, D>>
  implements FormComponentMarker, OnInit
{
  readonly label = input<TemplateRef<unknown>>();
  readonly data = input.required<D>();
  readonly inlineEdit = input<InlineEdit>({ enabled: true });

  readonly edited = output<D>();

  /**
   * The current state of the input data. The object is mutated in place (inline edit, edit modal),
   * so it's exposed as a signal which can be notified about these mutations.
   */
  readonly state = mutableSignal(this.data);

  previousValue?: T;

  constructor(
    protected modalService: ModalServiceService<T, D, E>,
    protected translate: TranslateService,
  ) {}

  defaultOnEditSubscribeEvent: (result: boolean | undefined) => void = (result) => {
    if (result) {
      touch(this.state);
      this.onEdit(untracked(this.state));
    }
  };

  ngOnInit() {
    this.previousValue = this.state().defaultValue;
  }

  abstract edit(): void;

  onEdit(modifiedData: D) {
    this.edited.emit(modifiedData);
  }

  onChange($event: Event) {
    const data = this.state();
    if (this.previousValue !== data.defaultValue) {
      this.onEdit(data);
      this.previousValue = data.defaultValue;
    }
  }
}