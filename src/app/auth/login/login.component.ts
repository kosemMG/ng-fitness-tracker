import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  constructor() { }

  ngOnInit() {
    this.loginForm = new FormGroup({
      email: new FormControl(null, [Validators.email, Validators.required]),
      password: new FormControl(null, [Validators.required])
    });
  }

  onSubmit() {
    console.log(this.loginForm);
  }

  get hasErrorRequired() {
    return this.loginForm.controls.email.hasError('required');
  }

  get hasErrorEmail() {
    return this.loginForm.controls.email.hasError('email');
  }
}
