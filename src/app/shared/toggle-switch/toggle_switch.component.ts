import { Component, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

const noop = () => {
};

export const toggleValue: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => ToggleSwitchComponent),
    multi: true
};

/**
* Simple Toggle Switch
*/
@Component({
    selector: 'ToggleSwitch',
    templateUrl: './toggle_switch.component.html',
    styleUrls: ['./toggle_switch.component.scss'],
    providers: [toggleValue]
})

export class ToggleSwitchComponent implements ControlValueAccessor {
    check_value: boolean = false;

    //Placeholders for the callbacks which are later providesd
    //by the Control Value Accessor
    private onTouchedCallback: () => void = noop;
    private onChangeCallback: (_: any) => void = noop;

    //get accessor
    get value(): any {
        return this.check_value;
    };

    //set accessor including call the onchange callback
    set value(v: any) {
        if (v !== this.check_value) {
            this.check_value = v;
            this.onChangeCallback(v);
        }
    }

    //Set touched on blur
    onBlur() {
        this.onTouchedCallback();
    }

    //From ControlValueAccessor interface
    writeValue(value: any) {
        if (value !== this.check_value) {
            this.check_value = value;
        }
    }

    //From ControlValueAccessor interface
    registerOnChange(fn: any) {
        this.onChangeCallback = fn;
    }

    //From ControlValueAccessor interface
    registerOnTouched(fn: any) {
        this.onTouchedCallback = fn;
    }

    checkbox() {
        // console.log('ToggleSwitch-check_value = ', this.check_value);
    };
}
