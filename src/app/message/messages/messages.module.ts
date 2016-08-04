import { NgModule }                 from '@angular/core';
import { FormsModule }              from '@angular/forms';
import { HttpModule }               from '@angular/http';
import { CommonModule }             from '@angular/common';
import { MessagesComponent }        from './messages.component';
import { MessagesRoutingModule }    from './messages-routing.module';
import { RealtorService }                  from '../../shared/realtorService';
import { LetterAvatarDirective } from '../../shared/letter-avatar.component';

@NgModule({
    imports: [
        FormsModule,
        HttpModule,
        CommonModule,
        MessagesRoutingModule
    ],
    declarations: [ 
        MessagesComponent,
        LetterAvatarDirective
    ],
    providers: [
        RealtorService
    ]
})
export class MessagesModule { }