import { NgModule }                         from '@angular/core';
import {FormControl, FormGroup}             from '@angular/forms';
import { CommonModule }                     from '@angular/common';

import {FormsModule, ReactiveFormsModule}   from '@angular/forms';
import { ToggleSwitchComponent }            from '../../shared/toggle-switch/toggle_switch.component';

import { BotDeploymentComponent }           from './deployment.component';
import { BotDeploymentRoutingModule }       from './deployment-routing.module';
import { Ng2Bs3ModalModule }                from 'ng2-bs3-modal/ng2-bs3-modal';

@NgModule({
    imports: [
        FormsModule,
        BotDeploymentRoutingModule,
        CommonModule,
        Ng2Bs3ModalModule
    ],
    declarations: [ 
        BotDeploymentComponent,
        ToggleSwitchComponent
    ]
})
export class BotDeploymentModule { }
