import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from "@angular/forms";
import { Subscription } from 'rxjs';

import { AuthService } from "../auth.service";
import { UIService } from "../../shared/ui.service";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit, OnDestroy {
  maxDate: Date;
  public isLoading = false;
  private loadingSubscription: Subscription;

  constructor(private authService: AuthService, private uiService: UIService) { }

  ngOnInit(): void {
    this.loadingSubscription = this.uiService.loadedStateChange
      .subscribe(loadingState => this.isLoading = loadingState);
    this.maxDate = new Date();
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 18);
  }

  ngOnDestroy(): void {
    this.loadingSubscription.unsubscribe();
  }

  onSubmit(form: NgForm): void {
    this.authService.registerUser({
      email: form.value.email,
      password: form.value.password
    });
  }
}
