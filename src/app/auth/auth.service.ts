import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { Router } from '@angular/router'

import { User } from "./user.model";
import { AuthData } from "./auth-data.model";

@Injectable({ providedIn: 'root' })
export class AuthService {
  authChange = new Subject<boolean>();
  private user: User;

  constructor(private router: Router) {
  }

  registerUser(authData: AuthData): void {
    this.user = {
      email: authData.email,
      userId: Math.round(Math.random() * 10000).toString()
    };
    this.authChange.next(true);
    this.redirect('training');
  }

  login(authData: AuthData): void {
    this.user = {
      email: authData.email,
      userId: Math.round(Math.random() * 10000).toString()
    };
    this.authChange.next(true);
    this.redirect('training');
  }

  logout(): void {
    this.user = null;
    this.authChange.next(false);
    this.redirect('login');
  }

  getUser(): User {
    return { ...this.user };
  }

  isAuth(): boolean {
    return this.user != null;
  }

  private redirect(...path: string[]): void {
    this.router.navigate(path)
      .catch(error => console.log('AuthService redirect() - ERROR:', error));
  }
}
