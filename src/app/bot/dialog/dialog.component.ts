import { Component, OnInit }    from '@angular/core';
import { Router }               from '@angular/router';
import { UserService }              from '../../shared/userService';
import { Config }                   from '../../shared/config/config';

@Component({
    templateUrl: './dialog.component.html',
	styleUrls: ['./dialog.component.scss']
})
export class BotDialogComponent implements OnInit {
	realtorObject: any;
	private errorMessage: string;
	botPhrases: Array<{phrase: string}>;

	constructor(
		private userService: UserService,
		private config: Config,
		private router: Router
	) {
		if(this.config.realtorId && this.config.realtorObject) {
			this.realtorObject = this.config.realtorObject;
			// console.log('BotDialogComponent-realtorObject = ', this.realtorObject);
			
			this.botPhrases = [];
			if(this.realtorObject.botPhrases.length) {
				for(let i = 0; i < this.realtorObject.botPhrases.length; i++) {
					this.botPhrases.push({
						phrase: this.realtorObject.botPhrases[i].phrase
					})
				}
			} else {
				this.botPhrases.push({
					phrase: ''
				});
			}
		} else {
			this.router.navigate(['/']);
		}
	};

	ngOnInit() {
	}

	addPhrase():void {
		this.botPhrases.push({
			phrase: ''
		});
	};

	delPhrase(item):void {
		if (this.botPhrases.indexOf(item) != -1) {
			this.botPhrases.splice(this.botPhrases.indexOf(item), 1);
		}
	};

	updateMessage(): void {
		this.realtorObject.botPhrases = this.botPhrases;

		this.userService.updateRealtorData(this.realtorObject)
		.subscribe(
			response  => {
				if(response.status == 200) {
					this.errorMessage = 'Update Successfully.';
				} else {
					this.errorMessage = 'Update Failed.';  
				}
				console.log('userService-BotDialogComponent-response = ', response);
			},
			error =>  {
				this.errorMessage = 'Update Failed.';
			}
		);
	};
}
