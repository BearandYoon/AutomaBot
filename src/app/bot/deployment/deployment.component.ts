import { Component, OnInit, 
	ViewChild }    					from '@angular/core';
import { Router }               	from '@angular/router';
import { UserService }              from '../../shared/userService';
import { RealtorService }           from '../../shared/realtorService';
import { Config }                   from '../../shared/config/config';
import { ToggleSwitchComponent } 	from '../../shared/toggle-switch/toggle_switch.component';
import {FacebookService,
	FacebookLoginResponse,
	FacebookInitParams} 			from 'ng2-facebook-sdk';

import * as io from "socket.io-client";

@Component({
    templateUrl: './deployment.component.html',
	styleUrls: ['./deployment.component.scss'],
	providers: [
		UserService,
		FacebookService,
		RealtorService
	]
})
export class BotDeploymentComponent implements OnInit {

	realtorData: any;
	webchat_flag: boolean = false;
	facebook_flag: boolean = false;
	sms_flag: boolean = false;
	wordpress_flag: boolean = false;
	private errorMessage: string;
	auth_domain: Array<{domain: string}>;
	message: string;
	javascript_code: string;
	isFacebookLoggedin: boolean;
	facebookAuthRes: any;
	facebookAvailableSites: any = [];
	facebookPendingSites: any = [];
	facebookActiveSites: any = [];
	selectedFBSite: any;
	twilio: any = {
		PHONE_NUMBER: '',
		AUTH_TOKEN: '',
		ACCOUNT_SID: ''
	};
	webchatKey: string = '';

	constructor(
		private userService: UserService,
		private realtorService: RealtorService,
		private config: Config,
		private router: Router,
		private fb: FacebookService
	) {
		let fbParams: FacebookInitParams = {
			appId: this.config.facebook_appId,
			xfbml: true,
			version: 'v2.6'
		};

		if(this.config.realtorId && this.config.realtorObject) {
			this.realtorData = this.config.realtorObject;
			// console.log('realtorObject = ', this.realtorData);
			this.facebookActiveSites = this.realtorData.fb
			this.auth_domain = [];

			if(this.realtorData.authorizedDomains.length > 0) {
				for(let i = 0; i < this.realtorData.authorizedDomains.length; i++) {
					this.auth_domain.push({
						domain: this.realtorData.authorizedDomains[i]
					})
				}
			} else {
				this.auth_domain.push({
					domain: ''
				});
			}

			if(this.realtorData.twilio) {
				this.twilio.PHONE_NUMBER = this.realtorData.twilio.PHONE_NUMBER,
				this.twilio.AUTH_TOKEN = this.realtorData.twilio.AUTH_TOKEN,
				this.twilio.ACCOUNT_SID = this.realtorData.twilio.ACCOUNT_SID
			};

			if(this.realtorData.webchatKey) {
				this.webchatKey = this.realtorData.webchatKey;
			}

			// console.log('deployment-auth_domain = ', this.auth_domain);
		} else {
			this.router.navigate(['/']);
		}

		this.fb.init(fbParams);
		this.getFacebookLoginStatus();
		this.loadFacebookPendingSites();
	}

	ngOnInit() {
		this.javascript_code = "<script id='automabots-embed'>var s=document.createElement('script');s.src='https://prod.automabots.com/v2/embed?referer=6&webchatkey=mqpxeqlv68l5';s.async=true;var embedder=document.getElementById('automabots-embed');embedder.parentNode.insertBefore(s,embedder)</script>";
	}

	checkbox(param) {
		switch(param) {
			case 'WebChat':
				// console.log('WebChat');
				this.webchat_flag = !this.webchat_flag;
				break;
			case 'Facebook':
				// console.log('Facebook');
				this.facebook_flag = !this.facebook_flag;
				break;
			case 'SMS':
				// console.log('SMS');
				this.sms_flag = !this.sms_flag;
				break;
			case 'Wordpress':
				// console.log('Wordpress');
				this.wordpress_flag = !this.wordpress_flag;
				break;
			default:
				console.log('Nothing');
		}
    };

	addDomain():void {
		this.auth_domain.push({
			domain: ''
		});
	};

	delDomain(item):void {
		if (this.auth_domain.indexOf(item) != -1) {
			this.auth_domain.splice(this.auth_domain.indexOf(item), 1);
		}
	};

	saveBotIntegraions():void {
		this.realtorData.authorizedDomains = [];
		for(let i = 0; i < this.auth_domain.length; i++) {
			this.realtorData.authorizedDomains.push(this.auth_domain[i].domain);
		}

		this.userService.updateRealtorData(this.realtorData)
			.subscribe(
				response  => {
					if(response.status == 200) {
						this.errorMessage = 'Bot Data Update Success.';
					} else {
						this.errorMessage = 'Bot Data Update Failed.';  
					}
					// console.log('userService-saveBotIntegraions-response = ', response);
				},
				error =>  {
					this.errorMessage = 'Bot Data Update Failed.';
				}
			);
	};

	getFacebookLoginStatus(): void {
		this.fb.getLoginStatus().then(response => {
			// console.log('getFacebookLoginStatus = ', response);
			if(response.status === 'connected') {
				this.isFacebookLoggedin = true;
				this.facebookAuthRes = response.authResponse;
				
				this.getFBpages();
			} else {
				this.isFacebookLoggedin = false;
			}
		}).catch(error => {
			console.log('getFacebookLoginStatus-Error = ', error);
		});
	};

	public loadFacebookPendingSites(): void {
		this.realtorService.getFacebookPendingSites()
			.subscribe(
			data => {
				this.facebookPendingSites = data;
				this.checkFBSitesStatus();
				// console.log('loadFacebookPendingSites = ', this.facebookPendingSites);
			},
			error => {
				console.log('loadFacebookPendingSites-error = ', error);
		});
  	};

	login_Facebook():void {
		this.fb.login('pages_show_list').then(response => {
			// console.log('login_Facebook = ', response);
			if(response.status === 'connected') {
				this.isFacebookLoggedin = true;
				this.facebookAuthRes = response.authResponse;

				this.getFBpages();
			} else {
				this.isFacebookLoggedin = false;
			}
		}).catch(error => {
			console.log('login_Facebook-Error = ', error);
		});
	};

	updateFBSite(): void {
		// console.log('updateFBSite = ', this.selectedFBSite);
	};

	getFBpages(): void {
		if(this.facebookAuthRes.userID) {
			let url = '/' + this.facebookAuthRes.userID + '/accounts';
			this.fb.api(url).then(response => {
				for(let i = 0; i < response.data.length; i++) {
					let data = response.data[i];
					
					for(let j = 0; j < data.perms.length; j++) {
						if(data.perms[j] === 'ADMINISTER') {
							this.facebookAvailableSites.push(data);
							break;
						}
					}
				}
				this.checkFBSitesStatus();

				if(this.facebookAvailableSites.length > 0) {
					this.selectedFBSite = this.facebookAvailableSites[0];
				}
				console.log('facebookAvailableSites = ', this.facebookAvailableSites);
				// console.log('selectedFBSite = ', this.selectedFBSite);
			})
		}	  
	};

	checkFBSitesStatus(): void {
		for(let i = 0; i < this.facebookAvailableSites.length; i++) {
			this.facebookAvailableSites[i].category = 'available';
			for(let j = 0; j < this.facebookActiveSites.length; j++) {
				if(this.facebookAvailableSites[i].id == this.facebookActiveSites[j].PAGE_ID) {
					this.facebookAvailableSites[i].category = 'active';
					break;
				}
			}

			for(let k = 0; k < this.facebookPendingSites.length; k++) {
				// console.log('checkFBSitesStatus - available = ', this.facebookAvailableSites[i]);
				// console.log('checkFBSitesStatus - pending = ', this.facebookPendingSites[k]);
				if(this.facebookAvailableSites[i].id == this.facebookPendingSites[k].page_id) {
					this.facebookAvailableSites[i].category = 'pending';
					break;
				}
			}
		}
	};

	deployFBSite(): void {
		this.realtorService.deployFacebookSite(this.selectedFBSite)
			.subscribe(
				data => {
					console.log('deployFacebookSite = ', data);
				},
				error => {
					console.log('deployFacebookSite = ', error);
				}
			);
		
		this.realtorData.fb.push({
			PAGE_ACCESS_TOKEN: this.selectedFBSite.access_token,
			PAGE_ID: this.selectedFBSite.id
		});

		this.userService.updateRealtorData(this.realtorData)
			.subscribe(
				response => {
					console.log('updateRealtorData = ', response);
				},
				error => {
					console.log('updateRealtorData - error = ', error);
				}
			);

		for(let i = 0; i < this.facebookAvailableSites.length; i++) {
			if(this.facebookAvailableSites[i].id === this.selectedFBSite.id) {
				this.facebookAvailableSites[i].category = 'pending';
			}
		}		
	};

	removeFBSite(): void {
		console.log('removeFBSite');
	};
}
