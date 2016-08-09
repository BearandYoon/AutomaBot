import { Component, HostBinding} from '@angular/core';

@Component({
    selector: 'body',
    template: '<router-outlet></router-outlet>'
})
export class AppComponent { 
    //@HostBinding('class') public cssClass = 'sidebar-nav compact-nav';
}
