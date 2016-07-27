import { Component, OnInit }            from '@angular/core';

import { BreadcrumbsComponent }         from '../shared/breadcrumb.component';
import { Config }                       from '../shared/config/config';
import { UserService }                  from '../shared/userService';
import { Router, CanActivate }          from '@angular/router';

export class SidebarOption {
  subname: Array<string> = new Array<string>();
  name: string;
}

@Component({
    selector: 'app-dashboard',
    templateUrl: './full-layout.component.html',
    styleUrls: ['./full-layout.component.scss']
})
export class FullLayoutComponent implements OnInit {
    
    sidebar_option: SidebarOption;
    username:string;

    realtors: Array<{ _id: string, name: string }>;
    auth_domain: Array<{domain: string}>;
    selectedRealtor: any;
    private errorMessage: string;
    
    constructor(
        private userService: UserService,
        private router: Router,
        private config: Config
    ) {
        if(this.config.user_type === 'staff') {
            this.realtors = this.config.realtors;
            this.selectedRealtor = this.realtors[0];
        }
        this.sidebar_option = new SidebarOption();
        this.selectOption('Leads');
    }

    ngOnInit(): void {
        console.log('config ', this.config.realtorObject);
        this.username = this.config.realtorObject['name'];
    }

    selectOption(option) {
        this.sidebar_option.subname = [];
        switch (option) {
            case 'Messages':
                this.sidebar_option.name = 'message';
                this.sidebar_option.subname.push('Messages');
                this.sidebar_option.subname.push('Placeholder');
                break;
            case 'Leads':
                this.sidebar_option.name = 'leads';
                this.sidebar_option.subname.push('All');
                this.sidebar_option.subname.push('Active');
                this.sidebar_option.subname.push('Closed');
                this.sidebar_option.subname.push('Failed');
                break;
            case 'Statistics':
                this.sidebar_option.name = 'statistics';
                this.sidebar_option.subname.push('placeholder1');
                this.sidebar_option.subname.push('placeholder2');
                break;
            case 'Bot':
                this.sidebar_option.name = 'bot';
                this.sidebar_option.subname.push('Dialogue');
                this.sidebar_option.subname.push('Design');
                this.sidebar_option.subname.push('Deployment');
                break;
            case 'User':
                this.sidebar_option.name = 'user';
                this.sidebar_option.subname.push('Profile');
                this.sidebar_option.subname.push('Account');
                this.sidebar_option.subname.push('Billing');
                break;
            case 'Admin':
                this.sidebar_option.name = 'admin';
                this.sidebar_option.subname.push('Facebook Queue');
                this.sidebar_option.subname.push('placeholder1');
                this.sidebar_option.subname.push('placeholder2');
                break;
            default:
        }
        // console.log('this.sidebarOptions = ', this.sidebar_option);
    };

    public filterSubmenuName(name, subname): string {
        let result = '/' + name.replace(/\s/g,'') + '/' + subname.replace(/\s/g,'') + '/';
        
        if(name === 'leads' && subname === 'All') {
            result = result.toLowerCase() + '/' + this.config.realtorId;
        } else {
            result = result.toLowerCase();
        }
        return result;
    }

    public updateRealtor() {
        this.config.realtorId = this.selectedRealtor._id;
        console.log('updateRealtor-config = ', this.config);
        this.getUserData();
    }

    public getUserData():void {
        this.userService.getRealtorDatafromId()
        .subscribe(
            data => {
                this.config.realtorObject = data.docs[0];
                this.router.navigate(['/leads/all', this.config.realtorId]);
            },
            error => {
                this.errorMessage = 'Connection Error.';
        });
  };
}

