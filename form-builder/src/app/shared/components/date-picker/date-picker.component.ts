import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-date-picker',
    templateUrl: './date-picker.component.html',
    styleUrls: ['./date-picker.component.css']
})
export class DatePickerComponent {
    @Input() questionValue!: string;
    @Input() answerValue!: Component;
}
