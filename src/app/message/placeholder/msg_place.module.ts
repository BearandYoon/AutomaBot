import { NgModule }                 from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessagesComponent }       from './msg_place.component';
import { MessagesRoutingModule }   from './msg_place-routing.module';

@NgModule({
    imports: [
        MessagesRoutingModule,
        CommonModule
    ],
    declarations: [ MessagesComponent ]
})
export class MessagesModule { }