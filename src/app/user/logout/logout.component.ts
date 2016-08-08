import { Component, OnInit }    from '@angular/core';
import { Router }               from '@angular/router';
import { Config }               from '../../shared/config/config';

@Component({
  template: ``,
  styles: [``]
})
export class LogoutComponent implements OnInit {

  constructor(
    private config: Config,
    private router: Router
  ) { }

  ngOnInit() {
    console.log('LogoutComponent');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('realtorObject');
    this.config.realtorId = '';
    this.config.realtorObject = [];
    this.router.navigate(['/']);
  }
}
