import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Observable } from 'rxjs';

import { Store } from '@ngrx/store';

import { AuthService } from "../auth.service";
import { UIService } from "../../shared/ui.service";
import * as fromRoot from '../../app.reducer';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isLoading$: Observable<boolean>;
  // private loadingSubscription: Subscription;

  constructor(private authService: AuthService,
              private uiService: UIService,
              private store: Store<fromRoot.State>) { }

  ngOnInit(): void {
    this.isLoading$ = this.store.select(fromRoot.getIsLoading);
    // this.loadingSubscription = this.uiService.loadedStateChange
    //   .subscribe(loadingState => this.isLoading = loadingState);
    this.loginForm = new FormGroup({
      email: new FormControl(null, [Validators.email, Validators.required]),
      password: new FormControl(null, [Validators.required])
    });
  }

  onSubmit(): void {
    this.authService.login({
      email: this.loginForm.value.email,
      password: this.loginForm.value.password
    });
  }

  get hasErrorRequired() {
    return this.loginForm.controls.email.hasError('required');
  }

  get hasErrorEmail() {
    return this.loginForm.controls.email.hasError('email');
  }
}
