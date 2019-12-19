import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanLoad, Route, Router, RouterStateSnapshot } from '@angular/router'
import { Observable } from "rxjs";
import { Store } from "@ngrx/store";
import { take } from "rxjs/operators";

// import { AuthService } from "./auth.service";
import * as fromRoot from '../app.reducer';

@Injectable(/* provided in app-routing.module */)
export class AuthGuard implements CanActivate, CanLoad {
  constructor(private store: Store<fromRoot.State>,
              // private authService: AuthService,
              // private router: Router,
              ) {
  }

  canActivate(route: ActivatedRouteSnapshot,
              routerState: RouterStateSnapshot): boolean | Promise<boolean> | Observable<boolean> {
    return this.store.select(fromRoot.getIsAuthenticated)
      .pipe(take(1));
    // if (this.authService.isAuth()) {
    //   return true;
    // } else {
    //   this.router.navigate(['login'])
    //     .catch(error => console.log('AuthGuard redirection ERROR:', error));
    // }
  }

  canLoad(route: Route): boolean | Promise<boolean> | Observable<boolean> {
    return this.store.select(fromRoot.getIsAuthenticated)
      .pipe(take(1));
    // if (this.authService.isAuth()) {
    //   return true;
    // } else {
    //   this.router.navigate(['login'])
    //     .catch(error => console.log('AuthGuard redirection ERROR:', error));
    // }
  }
}
