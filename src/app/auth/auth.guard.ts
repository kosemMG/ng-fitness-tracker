import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanLoad, Route, Router, RouterStateSnapshot } from '@angular/router'
import { Observable } from "rxjs";

import { AuthService } from "./auth.service";

@Injectable(/* provided in app-routing.module */)
export class AuthGuard implements CanActivate, CanLoad {
  constructor(private authService: AuthService,
              private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot,
              routerState: RouterStateSnapshot): boolean | Promise<boolean> | Observable<boolean> {
    if (this.authService.isAuth()) {
      return true;
    } else {
      this.router.navigate(['login'])
        .catch(error => console.log('AuthGuard redirection ERROR:', error));
    }
  }

  canLoad(route: Route): boolean | Promise<boolean> | Observable<boolean> {
    if (this.authService.isAuth()) {
      return true;
    } else {
      this.router.navigate(['login'])
        .catch(error => console.log('AuthGuard redirection ERROR:', error));
    }
  }
}
