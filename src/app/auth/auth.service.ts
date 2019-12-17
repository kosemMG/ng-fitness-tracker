import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { Router } from '@angular/router'

import { AngularFireAuth } from 'angularfire2/auth';

import { TrainingService } from "../training/training.service";
import { AuthData } from "./auth-data.model";
import {error, log} from "util";

@Injectable({ providedIn: 'root' })
export class AuthService {
  authChange = new Subject<boolean>();
  private isAuthenticated = false;

  constructor(private router: Router,
              private afAuth: AngularFireAuth,
              private trainingService: TrainingService) {
  }

  initAuthListener() {
    this.afAuth.authState
      .subscribe(user => {
        if (user) {
          this.isAuthenticated = true;
          this.authChange.next(true);
          this.redirect('training');
        } else {
          this.trainingService.cancelFirebaseSubscriptions();
          this.isAuthenticated = false;
          this.authChange.next(false);
          this.redirect('login');
        }
      });
  }

  registerUser(authData: AuthData): void {
    this.afAuth.auth
      .createUserWithEmailAndPassword(authData.email, authData.password)
      .then(() => {
        this.isAuthenticated = true;
        this.authChange.next(true);
        this.redirect('training');
      })
      .catch(error => console.log('AuthService registerUser() - ERROR:', error));
  }

  login(authData: AuthData): void {
    this.afAuth.auth
      .signInWithEmailAndPassword(authData.email, authData.password)
      .catch(error => console.log('AuthService login() - ERROR:', error));
  }

  logout(): void {
    this.afAuth.auth.signOut()
      .catch(error => console.log('AuthService logout() - ERROR:', error));
  }

  isAuth(): boolean {
    return this.isAuthenticated;
  }

  private redirect(...path: string[]): void {
    this.router.navigate(path)
      .catch(error => console.log('AuthService redirect() - ERROR:', error));
  }
}
