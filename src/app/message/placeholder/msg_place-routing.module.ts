import { NgModule }             from '@angular/core';
import { Routes, RouterModule }         from '@angular/router';

import { MessagesComponent }   from './msg_place.component';

const routes: Routes = [
    {
        path: '',
        component: MessagesComponent,
        data: {
            title: 'Messages-Placeholer'
        }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MessagesRoutingModule {}
