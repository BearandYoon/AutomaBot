import { NgModule }             from '@angular/core';
import { Routes,
         RouterModule }         from '@angular/router';

import { BotDialogComponent }   from './dialog.component';

const routes: Routes = [
    {
        path: '',
        component: BotDialogComponent,
        data: {
            title: 'BotDialogComponent'
        }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class BotDialogRoutingModule {}
