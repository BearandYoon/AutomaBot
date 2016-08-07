import { Component }                                from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd }    from '@angular/router';
import { AppComponent }            from '../app.component';

import 'rxjs/add/operator/filter';

@Component({
    selector: 'breadcrumbs',
    template: `
    <template ngFor let-breadcrumb [ngForOf]="breadcrumbs" let-last = last class="breadcrumb">
        <li class="breadcrumb-item" *ngIf="breadcrumb.label.title" [ngClass]="{active: last}">
        <a *ngIf="!last" [routerLink]="breadcrumb.url">{{breadcrumb.label.title}}</a>
        <span *ngIf="last" [routerLink]="breadcrumb.url">{{breadcrumb.label.title}}</span>
    </template>`,
    styles: [`
        .collapse-button {
            font-size: 16px;
            color: gray;
            float: left;
            margin-right: 30px;
        }
        .breadcrumb-item {
            padding-top: 5px;
        }
    `]
})
export class BreadcrumbsComponent {
    breadcrumbs: Array<Object>;
    collapseflag: boolean = true;

    constructor(private router:Router, private route:ActivatedRoute, private rootComp: AppComponent) {}

    public setClass(isOwner) {
        if(isOwner) {
            this.collapseflag = !this.collapseflag;
            if(this.collapseflag) {
                //this.rootComp.cssClass = 'sidebar-nav compact-nav';
            } else {
                //this.rootComp.cssClass = 'sidebar-nav';
            }  
        } else {
            this.collapseflag = false;
            //this.rootComp.cssClass = 'sidebar-nav';
        }          
    }

    ngOnInit(): void {
        this.router.events.filter(event => event instanceof NavigationEnd).subscribe(event => {
            this.breadcrumbs = [];
            let currentRoute = this.route.root,
            url = '';
            do {
                let childrenRoutes = currentRoute.children;
                currentRoute = null;
                childrenRoutes.forEach(route => {
                    if(route.outlet === 'primary') {
                        let routeSnapshot = route.snapshot;
                        url += '/' + routeSnapshot.url.map(segment => segment.path).join('/');
                        this.breadcrumbs.push({
                            label: route.snapshot.data,
                            url:   url
                        });
                        currentRoute = route;
                    }
                })
            } while(currentRoute);
        })
    }
}
