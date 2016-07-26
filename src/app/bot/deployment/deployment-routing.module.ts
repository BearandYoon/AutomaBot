import { NgModule }             from '@angular/core';
import { Routes,
         RouterModule }         from '@angular/router';

import { BotDeploymentComponent }   from './deployment.component';

const routes: Routes = [
    {
        path: '',
        component: BotDeploymentComponent,
        data: {
            title: 'Bot/Deployment'
        }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class BotDeploymentRoutingModule {}
