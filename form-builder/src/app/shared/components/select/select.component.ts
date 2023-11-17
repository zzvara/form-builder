import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-select',
    templateUrl: './select.component.html',
    styleUrls: ['./select.component.css']
})
export class SelectComponent {
    @Input() questionValue!: string;
    //@Input() answerValue!: Component;
    @Input() answerOptions!: string[];
}
