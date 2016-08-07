import { Injectable }               from '@angular/core';
import { CanActivate }              from '@angular/router';
import { UserService }              from './userService';
import { Router }                   from '@angular/router';

@Injectable()
export class CanActivateViaAuthGuard implements CanActivate {

  constructor(
    private authService: UserService,
    private router: Router
  ) {}

  canActivate() {
    if(this.authService.isLoggedIn()) {
        return true;
    } else {
        this.router.navigate(['/login']);
        // abort current navigation
        return false;
    }
  }
}