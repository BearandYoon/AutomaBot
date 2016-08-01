import { NgModule }             from '@angular/core';
import { Routes,
         RouterModule }         from '@angular/router';

import { LeadsComponent }   from './leads.component';

const routes: Routes = [
    {
        path: '',
        component: LeadsComponent,
        data: {
            title: 'Leads'
        }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LeadsRoutingModule {}
