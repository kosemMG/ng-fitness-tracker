import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Subscription } from 'rxjs';

import { AuthService } from "../auth.service";
import { UIService } from "../../shared/ui.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  isLoading = false;
  private loadingSubscription: Subscription;

  constructor(private authService: AuthService, private uiService: UIService) { }

  ngOnInit(): void {
    this.loadingSubscription = this.uiService.loadedStateChange
      .subscribe(loadingState => this.isLoading = loadingState);
    this.loginForm = new FormGroup({
      email: new FormControl(null, [Validators.email, Validators.required]),
      password: new FormControl(null, [Validators.required])
    });
  }

  ngOnDestroy(): void {
    this.loadingSubscription.unsubscribe();
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
