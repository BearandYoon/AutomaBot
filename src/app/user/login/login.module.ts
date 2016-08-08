import { NgModule }                 from '@angular/core';
import { FormsModule }              from '@angular/forms';
import { HttpModule }               from '@angular/http';
import { CommonModule }             from '@angular/common';

import { LoginComponent }           from './login.component';
import { LoginRoutingModule }       from './login-routing.module';
import { UserService }              from '../../shared/userService';
import * as spinner                 from 'ng-spin-kit/app/spinners'

@NgModule({
    imports: [
        FormsModule,
        HttpModule,
        CommonModule,
        LoginRoutingModule
    ],
    declarations: [ 
        LoginComponent,
        spinner.ThreeBounceComponent
    ],
    providers: [
        UserService
    ]
})
export class LoginModule { }