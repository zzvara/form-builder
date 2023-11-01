import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextInputComponent } from './text-input.component';

xdescribe('TextInputComponent', () => {
    let component: TextInputComponent;
    let fixture: ComponentFixture<TextInputComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [TextInputComponent]
        });
        fixture = TestBed.createComponent(TextInputComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
