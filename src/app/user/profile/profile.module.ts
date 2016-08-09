import { NgModule }                 from '@angular/core';
import { FormsModule }              from '@angular/forms';
import { CommonModule }             from '@angular/common';

import { ProfileComponent }         from './profile.component';
import { ProfileRoutingModule }     from './profile-routing.module';
import { SelectModule }             from 'ng2-select';

@NgModule({
    imports: [
        ProfileRoutingModule,
        FormsModule,
        CommonModule,
        SelectModule
    ],
    declarations: [ 
        ProfileComponent
    ]
})
export class ProfileModule { }