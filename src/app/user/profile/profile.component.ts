import { Component, OnInit }        from '@angular/core';
import { Router }                   from '@angular/router';
import { UserService }              from '../../shared/userService';
import { RealtorService }           from '../../shared/realtorService';
import { Config }                   from '../../shared/config/config';
import { SelectModule }             from 'ng2-select';

@Component({
  selector: 'user-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  providers: [
    UserService,
    RealtorService
  ]
})
export class ProfileComponent implements OnInit {

  user: any;
  phones: Array<{phone: string}>;
  emails: Array<{email: string}>;
  private errorMessage: string;
  private markets: Array<any> = [];
  public marketOptions:Array<any> = [];
  public originMarketOptions:Array<any> = [];
  public tempMarketOptions:Array<any> = [];
  public marketOptions1:Array<any> = [];

  constructor(
    private userService: UserService,
    private realtorService: RealtorService,
    private config: Config,
    private router: Router
  ) {
      console.log('ProfileComponent');
      this.phones = [];
      this.emails = [];

      this.getAvailableMarkets();

      if(this.config.realtorId && this.config.realtorObject) {
        this.user = this.config.realtorObject;
        // console.log('realtorObject = ', this.user);
        if(this.user.phoneNumbers) {
          for(let i = 0; i < this.user.phoneNumbers.length; i++) {
            this.phones.push({
              phone: this.user.phoneNumbers[i]
            })
          }
        }

        if(this.user.emailAddresses) {
          for(let i = 0; i < this.user.emailAddresses.length; i++) {
            this.emails.push({
              email: this.user.emailAddresses[i]
            })
          }
        }
      } else {
        this.router.navigate(['/']);
      }
  }

  ngOnInit() {}

  addPhoneNumber():void {
    this.phones.push({
      phone: ''
    });
  }

  delPhoneNumber(item):void {
    if (this.phones.indexOf(item) != -1) {
        this.phones.splice(this.phones.indexOf(item), 1);
    }
  }

  addEmail():void {
    this.emails.push({
      email: ''
    });
  }

  delEmail(item):void {
    if (this.emails.indexOf(item) != -1) {
        this.emails.splice(this.emails.indexOf(item), 1);
    }
  }

  saveUserProfile():void {
    this.user.phoneNumbers = [];
    this.user.emailAddresses = [];

    for(let i = 0; i < this.phones.length; i++) {
      this.user.phoneNumbers.push(this.phones[i].phone);
    }

    for(let i = 0; i < this.emails.length; i++) {
      this.user.emailAddresses.push(this.emails[i].email);
    }

    this.user.markets = [];
    for(let i = 0; i < this.markets.length; i++) {
      this.user.markets.push(this.markets[i].id);
    }
    this.updateUserProfile();
  }

  public updateUserProfile():void {
    this.userService.updateRealtorData(this.user)
      .subscribe(
        response  => {
          if(response.status == 200) {
            this.errorMessage = 'User Profile Update Success.';
          } else {
            this.errorMessage = 'User Profile Update Failed.';  
          }
        },
        error =>  {
          this.errorMessage = 'User Profile Update Failed.';
        }
    );
  };  
 
  private value:any = [''];
 
  public selected(value:any):void {
    this.markets.push(value);
  };
 
  public removed(value:any):void {
    for(let i = 0; i < this.markets.length; i++) {
      if(this.markets[i].id === value.id) {
        this.markets.splice(i, 1);
      }
    }
  };
 
  public refreshValue(value:any):void {
    this.value = value;
  };
 
  public itemsToString(value:Array<any> = []):string {
    return value
      .map((item:any) => {
        return item.text;
      }).join(',');
  };

    public getAvailableMarkets(): void {
    this.realtorService.getAvailableMarketOptions()
      .subscribe(data => {
        this.originMarketOptions = data.docs;

        for(let i = 0; i < this.originMarketOptions.length; i++) {
          this.tempMarketOptions.push(
            {
              id : this.originMarketOptions[i].dataServerName,
              text : this.originMarketOptions[i].market
            }
          );
        }
        this.marketOptions = this.tempMarketOptions;

        if(this.user.markets) {
          let temp: any = [];
          for(let i = 0; i < this.user.markets.length; i++) {
            for(let j = 0; j < this.originMarketOptions.length; j++) {
              if(this.user.markets[i] === this.originMarketOptions[j].dataServerName) {
                temp.push(
                {
                  id : this.originMarketOptions[j].dataServerName,
                  text : this.originMarketOptions[j].market
                });
              }
            }
          }
          this.markets = temp;
        }
      });
  }
}
