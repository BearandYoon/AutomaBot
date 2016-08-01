import { NgModule }             from '@angular/core';
import { Routes,
         RouterModule }         from '@angular/router';

import { LeadComponent }   from './lead.component';

const routes: Routes = [
    {
        path: '',
        component: LeadComponent,
        data: {
            title: 'Leads'
        }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LeadRoutingModule {}
