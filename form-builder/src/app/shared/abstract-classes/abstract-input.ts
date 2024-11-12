import {Directive, EventEmitter, Input, Output} from "@angular/core";

@Directive()
export abstract class AbstractInput {
  @Input() id!: string;
  @Input() type!: string;
  @Input() questionValue!: string;
  @Input() descriptionValue!: string;
  @Input() sectionId!: string;
  @Input() answerValue!: any;

  @Output() removeComponentEvent = new EventEmitter<string>();
}
