import {NgComponentOutlet} from "@angular/common";
import {
  AfterViewInit,
  Component,
  DestroyRef,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {AbstractInput} from "../../abstract-classes/abstract-input";
import {FormInputData} from "../../interfaces/form-input-data";
import {InputData} from "../../interfaces/input-data";
import {InlineEdit} from "../../interfaces/inline-edit";
import {getInputGroups} from "../../../pages/edit/config/edit-data-config";

@Component({
  selector: 'app-input-holder',
  templateUrl: './input-holder.component.html',
  styleUrls: ['./input-holder.component.css']
})
export class InputHolderComponent<D extends InputData<T>, T> implements OnInit, AfterViewInit {
  private readonly destroyRef = inject(DestroyRef);

  @Input() formInput!: FormInputData<D, T>;
  get inputData() :D {
    return this.formInput.data!;
  }

  @Output() edited = new EventEmitter<D>();
  @Output() removeComponentEvent = new EventEmitter<string>();

  @ViewChild(NgComponentOutlet) inputOutlet!: NgComponentOutlet;

  componentInputs!: {
    data: D,
    inlineEdit: InlineEdit
  };

  inlineEdit: InlineEdit = { enabled: true };

  get embeddedComponent(): AbstractInput<D, T> {
    return this.inputOutlet['_componentRef'].instance;
  }

  ngOnInit(): void {
    this.componentInputs = {
      data: this.inputData,
      inlineEdit: this.inlineEdit
    }
  }

  ngAfterViewInit() {
    if (this.inputOutlet) {
      this.embeddedComponent.edited
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((data: D) => {
          this.edited.emit(data);
        });
    }
  }

  removeComponent() {
    this.removeComponentEvent.emit(this.inputData.id);
  }

  resetComponent() {
    const defaultData: FormInputData<D, T> | undefined = getInputGroups().find((group) => group.type === this.formInput.type);
    if (defaultData) {
      Object.keys(this.inputData)
        .filter(key => key !== "id" && key !== "sectionId")
        .forEach(key => {
          this.inputData[key as keyof D] = defaultData.data![key as keyof D];
        });
    }
  }

  editComponent() {
    if (this.inputOutlet) {
      this.embeddedComponent.edit();
    }
  }

  change() {
    this.edited.emit(this.inputData);
  }
}
