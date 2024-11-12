import {NgComponentOutlet} from "@angular/common";
import {AfterViewInit, Component, DestroyRef, EventEmitter, inject, Input, OnInit, Output, ViewChild} from '@angular/core';
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {AbstractInput} from "../../abstract-classes/abstract-input";
import {FormInputData} from "../../interfaces/form-input-data";
import {InputData} from "../../interfaces/input-data";

@Component({
  selector: 'app-input-holder',
  templateUrl: './input-holder.component.html',
  styleUrls: ['./input-holder.component.css']
})
export class InputHolderComponent<D extends InputData<T>, T> implements OnInit, AfterViewInit {
  private readonly destroyRef = inject(DestroyRef);

  @Input() formInput!: FormInputData<D, T>;

  @Output() edited = new EventEmitter<D>();
  @Output() removeComponentEvent = new EventEmitter<string>();

  @ViewChild(NgComponentOutlet) inputOutlet!: NgComponentOutlet;

  componentInputs!: Record<string, D>;

  get embeddedComponent(): AbstractInput<D, T> {
    return this.inputOutlet['_componentRef'].instance;
  }

  ngOnInit(): void {
    this.componentInputs = {
      defaultValues: this.formInput.data!
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
    this.removeComponentEvent.emit(this.formInput.data?.id);
  }

  editComponent() {
    if (this.inputOutlet) {
      this.embeddedComponent.edit();
    }
  }
}
