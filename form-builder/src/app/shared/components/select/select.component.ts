import {Component, EventEmitter, Input, Output, TemplateRef} from '@angular/core';

@Component({
    selector: 'app-select',
    templateUrl: './select.component.html',
    styleUrls: ['./select.component.css']
})
export class SelectComponent {
    @Input() id!: string;
    descriptionValue: string = 'The input can be used for...';
    inputPlaceholder: string = 'Select input value';
    inputTemplate!: TemplateRef<any>;
    type: string = 'text';
    questionValue!: string;
    answerValue!: Component;
    @Input() answerOptions!: string[];
    @Input() sectiondId!: string;

    @Output() removeComponentEvent = new EventEmitter<string>();
}
