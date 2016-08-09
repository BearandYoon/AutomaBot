import { NgModule }                 from '@angular/core';
import { Routes,
         RouterModule }             from '@angular/router';
import { CanActivateViaAuthGuard }  from './shared/canActiveGuard';
//Layouts
import { FullLayoutComponent }      from './layouts/full-layout.component';
import { LoginComponent }           from './user/login/login.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: '',
        component: FullLayoutComponent,
        data: {
            title: 'Home'
        },
        children: [
            {
                path: 'bot/dialogue',
                loadChildren: 'app/bot/dialog/dialog.module#BotDialogModule',
                canActivate: [CanActivateViaAuthGuard]
            },
            {
                path: 'bot/design',
                loadChildren: 'app/bot/design/design.module#BotDesignModule',
                canActivate: [CanActivateViaAuthGuard]
            },
            {
                path: 'bot/deployment',
                loadChildren: 'app/bot/deployment/deployment.module#BotDeploymentModule',
                canActivate: [CanActivateViaAuthGuard]
            },
            {
                path: 'message/messages',
                loadChildren: 'app/message/messages/messages.module#MessagesModule',
                canActivate: [CanActivateViaAuthGuard]
            },
            {
                path: 'message/placeholder',
                loadChildren: 'app/message/placeholder/msg_place.module#MessagesModule',
                canActivate: [CanActivateViaAuthGuard]
            },
            {
                path: 'user/logout',
                loadChildren: 'app/user/logout/logout.module#LogoutModule',
                canActivate: [CanActivateViaAuthGuard]
            },
            {
                path: 'user/profile',
                loadChildren: 'app/user/profile/profile.module#ProfileModule',
                canActivate: [CanActivateViaAuthGuard]
            },
            {
                path: 'leads/all/:id',
                loadChildren: 'app/leads/all/leads.module#LeadsModule',
                canActivate: [CanActivateViaAuthGuard]
            },
            {
                path: 'leads/singlelead/:id',
                loadChildren: 'app/leads/lead/lead.module#LeadModule',
                canActivate: [CanActivateViaAuthGuard]
            },
            {
                path: 'leads/singlelead',
                loadChildren: 'app/leads/lead/lead.module#LeadModule',
                canActivate: [CanActivateViaAuthGuard]
            },
            {
                path: 'admin/facebookqueue',
                loadChildren: 'app/admin/facebook/facebook.module#FacebookModule',
                canActivate: [CanActivateViaAuthGuard]
            }
        ]
    }
];

@NgModule({
    imports: [ RouterModule.forRoot(routes) ],
    exports: [ RouterModule ]
})
export class AppRoutingModule {}
