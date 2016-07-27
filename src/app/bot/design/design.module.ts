import { NgModule }                 from '@angular/core';

import { BotDesignComponent }       from './design.component';
import { BotDesignRoutingModule }   from './design-routing.module';
import { ColorPickerModule }        from 'angular2-color-picker';
import { FormsModule }              from '@angular/forms';
import { CommonModule }             from '@angular/common';

@NgModule({
    imports: [
        BotDesignRoutingModule,
        ColorPickerModule,
        FormsModule,
        CommonModule,
    ],
    declarations: [ BotDesignComponent ]
})
export class BotDesignModule { }
