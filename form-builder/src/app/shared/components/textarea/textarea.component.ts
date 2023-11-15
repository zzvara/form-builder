import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-textarea',
    templateUrl: './textarea.component.html',
    styleUrls: ['./textarea.component.css']
})
export class TextareaComponent {
    @Input() questionValue!: string;
    @Input() answerValue!: Component;
    @Input() textareaPlaceholder!: string;
}
