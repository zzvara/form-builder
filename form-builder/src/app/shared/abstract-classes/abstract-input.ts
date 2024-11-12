import {Directive, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {InputData} from "../interfaces/input-data";
import {AbstractFormComponent} from "./abstract-form-component";

@Directive()
export abstract class AbstractInput<D extends InputData<T>, T> extends AbstractFormComponent implements OnInit{
  sectionId!: string;

  questionValue!: string;
  descriptionValue!: string;
  placeholderValue!: string;
  defaultValue?: T;

  @Input() defaultValues!: D;

  @Output() edited = new EventEmitter<D>();

  ngOnInit(): void {
    Object.keys(this.defaultValues).forEach(key => {
      this[key as keyof typeof this] = this.defaultValues[key as keyof D] as any;
    });
  }

  abstract edit(): void;

  onEdit(data: D) {
    this.edited.emit(data);
  }

  getComponentData(): D {
    const data: D = Object.create(this.defaultValues);
    Object.keys(data).forEach(key => {
      data[key as keyof D] = this[key as keyof typeof this] as any;
    });
    return data;
  }


  onChange($event: any) {
    this.onEdit(this.getComponentData())
  }
}
