import { NgModule }                 from '@angular/core';
import { FormsModule }              from '@angular/forms';

import { LogoutComponent }          from './logout.component';
import { LogoutRoutingModule }      from './logout-routing.module';

@NgModule({
    imports: [
        LogoutRoutingModule,
        FormsModule
    ],
    declarations: [ LogoutComponent ]
})
export class LogoutModule { }