import { NgModule }                         from '@angular/core';
import {FormControl,FormGroup}              from '@angular/forms';

import {FormsModule,
    ReactiveFormsModule}                    from '@angular/forms';
import { CommonModule }                     from '@angular/common';
import { BotDialogComponent }               from './dialog.component';
import { BotDialogRoutingModule }           from './dialog-routing.module';

@NgModule({
    imports: [
        FormsModule,
        BotDialogRoutingModule,
        CommonModule
    ],
    declarations: [ BotDialogComponent ]
})
export class BotDialogModule { }
