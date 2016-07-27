import { Component, OnInit }    from '@angular/core';
import { Router }               from '@angular/router';
import { ColorPickerService } 	from 'angular2-color-picker';
import { UserService }              from '../../shared/userService';
import { Config }                   from '../../shared/config/config';
import { BotDesignModel }                   from '../../models/botDesignModel';

@Component({
  templateUrl: './design.component.html',
	styleUrls: ['./design.component.scss']
})

export class BotDesignComponent implements OnInit {
	realtorObject: any;
	private errorMessage: string;
	private bot: BotDesignModel;
	private IschangeValue: boolean = false;

  constructor(
		private cpService: ColorPickerService,
		private userService: UserService,
		private config: Config,
		private router: Router
	) {
		if(this.config.realtorId && this.config.realtorObject) {
			this.realtorObject = this.config.realtorObject;
		} else {
			this.router.navigate(['/']);
		}
	}

	ngOnInit() {
		this.initBotObject();
	};

	public initBotObject(): void {
		this.bot = {
			_id: '',
			chatWindow: {
				bg: '#127bdc',
				sentBubble: '#127bdc',
				userBubble: '#127bdc',
				quickReplies: {
					bg: '#127bdc',
					border: '#127bdc'
				}
			},
			infoBox: {
				body: {
					bg: '#127bdc'
				},
				header: {
					bg: '#127bdc',
					title: '#127bdc',
					subtitle: '#127bdc'
				}
			},
			navbar: {
				bg: '#127bdc',
				logo: ''
			},
			bot: {
				name: 'bot',
				email: 'bot@email.com',
				avatar: '../../../assets/img/avatars/no-avatar.png'
			},
		};

		this.userService.getRealtorDatafromId()
			.subscribe(
				data => {
					this.config.realtorObject = data.docs[0];
					localStorage.setItem('realtorObject', JSON.stringify(data.docs[0]));
					this.IschangeValue = false;
					//this.router.navigate(['/leads/all', this.config.realtorId]);
				},
				error => {
					this.IschangeValue = false;
					this.errorMessage = 'Connection Error.';
		});

		let botInfo = this.realtorObject.botDetails;
		this.bot._id = botInfo._id;
		if(botInfo.bot) {
			if(botInfo.bot.name) {
				this.bot.bot.name = botInfo.bot.name;
			} else {
				this.bot.bot.name = '';
			}
		} else {
			this.bot.bot.name = '';
			this.bot.bot.email = '';
			this.bot.bot.avatar = '../../../assets/img/avatars/no-avatar.png';
		}

		if(botInfo.navbar) {
			if(botInfo.navbar.bg) {
				this.bot.navbar.bg = botInfo.navbar.bg;
			} else {
				this.bot.navbar.bg = '#127bdc';
			}

			if(botInfo.navbar.logo) {
				this.bot.navbar.logo = botInfo.navbar.logo;
			} else {
				this.bot.navbar.logo = '';
			}
		} else {
			this.bot.navbar.bg = '#127bdc';
			this.bot.navbar.logo = '';
		}

		if(botInfo.infoBox) {
			if(botInfo.infoBox.header) {
				if(botInfo.infoBox.header.bg) {
					this.bot.infoBox.header.bg = botInfo.infoBox.header.bg;
				} else {
					this.bot.infoBox.header.bg = '#127bdc';
				}

				if(botInfo.infoBox.header.title) {
					this.bot.infoBox.header.title = botInfo.infoBox.header.title;
				} else {
					this.bot.infoBox.header.title = '#127bdc';
				}

				if(botInfo.infoBox.header.subtitle) {
					this.bot.infoBox.header.subtitle = botInfo.infoBox.header.subtitle;
				} else {
					this.bot.infoBox.header.subtitle = '#127bdc';
				}
			} else {
				this.bot.infoBox.header.bg = '#127bdc';
				this.bot.infoBox.header.title = '#127bdc';
				this.bot.infoBox.header.subtitle = '#127bdc';
			}

			if(botInfo.infoBox.body.bg) {
				this.bot.infoBox.body.bg = botInfo.infoBox.body.bg;
			} else {
				this.bot.infoBox.body.bg = '#127bdc';
			}
		} else {
			this.bot.infoBox.header.bg = '#127bdc';
			this.bot.infoBox.header.title = '#127bdc';
			this.bot.infoBox.header.subtitle = '#127bdc';
			this.bot.infoBox.body.bg = '#127bdc';
		}

		if(botInfo.chatWindow) {
			if(botInfo.chatWindow.bg) {
				this.bot.chatWindow.bg = botInfo.chatWindow.bg;
			} else {
				this.bot.chatWindow.bg = '#127bdc';
			}

			if(botInfo.chatWindow.userBubble) {
				this.bot.chatWindow.userBubble = botInfo.chatWindow.userBubble;
			} else {
				this.bot.chatWindow.userBubble = '#127bdc';
			}

			if(botInfo.chatWindow.sentBubble) {
				this.bot.chatWindow.sentBubble = botInfo.chatWindow.sentBubble;
			} else {
				this.bot.chatWindow.sentBubble = '#127bdc';
			}

			if(botInfo.chatWindow.quickReplies) {
				if(botInfo.chatWindow.quickReplies.bg) {
					botInfo.chatWindow.quickReplies.bg = this.bot.chatWindow.quickReplies.bg;
				} else {
					this.bot.chatWindow.quickReplies.bg = '#127bdc';
				}

				if(botInfo.chatWindow.quickReplies.border) {
					botInfo.chatWindow.quickReplies.border = this.bot.chatWindow.quickReplies.border;
				} else {
					this.bot.chatWindow.quickReplies.border = '#127bdc';
				}
			} else {
				this.bot.chatWindow.quickReplies.bg = '#127bdc';
				this.bot.chatWindow.quickReplies.border = '#127bdc';
			}
		} else {
			this.bot.chatWindow.bg = '#127bdc';
			this.bot.chatWindow.userBubble = '#127bdc';
			this.bot.chatWindow.sentBubble = '#127bdc';
			this.bot.chatWindow.quickReplies.bg = '#127bdc';
			this.bot.chatWindow.quickReplies.border = '#127bdc';
		}
	};

	public saveBotDesign(): void {
		if(this.IschangeValue) {
			this.realtorObject.botDetails = this.bot;
			this.IschangeValue = false;
			this.userService.updateRealtorData(this.realtorObject)
			.subscribe(
				response  => {
					if(response.status == 200) {
						this.errorMessage = 'Update Success.';
						this.IschangeValue = false;
						this.initBotObject();
					} else {
						this.errorMessage = 'Update Failed.';  
					}
					 //console.log('userService-BotDialogComponent-response = ', response);
				},
				error =>  {
					this.errorMessage = 'Update Failed.';
					this.IschangeValue = true;
				}
			);
		}
	}

	detectChanges(newValue) {
		if(JSON.stringify(this.realtorObject.botDetails) !== JSON.stringify(this.bot)) {
			this.IschangeValue = true;
		} else {
			this.IschangeValue = false;
		}
		// console.log('IschangeValue = ', this.IschangeValue);
	}
}