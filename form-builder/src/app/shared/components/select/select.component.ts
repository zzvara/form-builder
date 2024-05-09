import { Component, Input, TemplateRef } from '@angular/core';

@Component({
    selector: 'app-select',
    templateUrl: './select.component.html',
    styleUrls: ['./select.component.css']
})
export class SelectComponent {
    //questionValue: string = 'Select input';
    descriptionValue: string = 'The input can be used for...';
    //answerValue: any = 'Select answer';
    inputPlaceholder: string = 'Select input value';
    inputTemplate!: TemplateRef<any>;
    type: string = 'text';
    /* @Input() */ questionValue!: string;
    /* @Input() */ answerValue!: Component;
    @Input() answerOptions!: string[];
    @Input() sectiondId!: string;
}
