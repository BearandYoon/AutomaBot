import { NgModule }             from '@angular/core';
import { Routes,
         RouterModule }         from '@angular/router';

import { BotDesignComponent }   from './design.component';

const routes: Routes = [
    {
        path: '',
        component: BotDesignComponent,
        data: {
            title: 'BotDesignComponent'
        }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class BotDesignRoutingModule {}
