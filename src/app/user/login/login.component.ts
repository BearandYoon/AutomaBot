import { Component, OnInit }        from '@angular/core';
import { Router, CanActivate }      from '@angular/router';
import { UserService }              from '../../shared/userService';
import { Config }                   from '../../shared/config/config';
import { RotatingPlaneComponent }   from 'ng-spin-kit/app/spinner/rotating-plane.component'

export class User {
  name: string;
  password: string;
}

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [UserService]
})
export class LoginComponent implements OnInit {

  private errorMessage: string;
  private auth: string;
  private user: User;
  userData: any = [];
  callingAPI:boolean = false;
  isEmailValid: boolean;

  constructor(private userService: UserService, private config: Config, private router: Router) {
    this.isEmailValid = false;
  }

  ngOnInit() {
    this.user = {
      name: '',
      password: ''
    };
  }

  public login(): void {
    this.callingAPI = true;
    this.userService.login(this.user)
      .subscribe(
        auth  => {
          // console.log('userService-login-response = ', auth.msg);
          this.config.realtorId = auth.msg[0].realtor_id;
          this.config.user_type = auth.msg[0].user_type;
          localStorage.setItem('currentUser', JSON.stringify(auth.msg[0]));
          if(this.config.user_type === 'client') {
            this.getUserData();
          } else {
            this.getRealtorsName();
          }
        },
        error =>  {
          this.callingAPI = false;
          this.errorMessage = 'The username or password is incorrect.';
        }
      );
  };

  public onEmailChange(): void {
    if (this.user.name.length > 5 && this.isValid()) {
      this.isEmailValid = true;
    } else {
      this.isEmailValid = false;
    }
  }

  private isValid() {
    var regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(this.user.name);
  }

  public getUserData(): void {
    this.userService.getRealtorDatafromId()
      .subscribe(
        data => {
          this.config.realtorObject = data.docs[0];
          localStorage.setItem('realtorObject', JSON.stringify(data.docs[0]));
          this.callingAPI = false;
          this.router.navigate(['/leads/all', this.config.realtorId]);
        },
        error => {
          this.callingAPI = false;
          this.errorMessage = 'Connection Error.';
      });
  };

  public getRealtorsName():void {
    this.userService.getRealtorsName()
        .subscribe(
          data => {
            this.config.realtors = data.docs;
            this.config.realtorId = this.config.realtors[0]._id;
            this.getUserData();
          },
          error => {
            console.log('getRealtorsName-error = ', error);
          }
        )
  };

  ngAfterViewInit() {}

  public onSignIn(googleUser) {};
}
