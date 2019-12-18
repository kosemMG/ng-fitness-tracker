import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { Router } from '@angular/router'

import { AngularFireAuth } from 'angularfire2/auth';
import { Store } from "@ngrx/store";

import { TrainingService } from "../training/training.service";
import { UIService } from "../shared/ui.service";
import { AuthData } from "./auth-data.model";
import * as fromRoot from '../app.reducer';
import * as UI from '../shared/ui.actions';

@Injectable({ providedIn: 'root' })
export class AuthService {
  authChange = new Subject<boolean>();
  private isAuthenticated = false;

  constructor(private router: Router,
              private afAuth: AngularFireAuth,
              private trainingService: TrainingService,
              private uiService: UIService,
              private store: Store<fromRoot.State>) {
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
    // this.uiService.loadedStateChange.next(true);
    this.store.dispatch(new UI.StartLoading());
    this.afAuth.auth
      .createUserWithEmailAndPassword(authData.email, authData.password)
      // .then(() => this.uiService.loadedStateChange.next(false))
      .then(() => this.store.dispatch(new UI.StopLoading()))
      .catch(error => {
        // this.uiService.loadedStateChange.next(false);
        this.store.dispatch(new UI.StopLoading());
        this.uiService.showSnackbar(error.message, 3500);
      });
  }

  login(authData: AuthData): void {
    // this.uiService.loadedStateChange.next(true);
    this.store.dispatch(new UI.StartLoading());
    this.afAuth.auth
      .signInWithEmailAndPassword(authData.email, authData.password)
      // .then(() => this.uiService.loadedStateChange.next(false))
      .then(() => this.store.dispatch(new UI.StopLoading()))
      .catch(error => {
        // this.uiService.loadedStateChange.next(false);
        this.store.dispatch(new UI.StopLoading());
        this.uiService.showSnackbar(error.message, 3500);
      });
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
