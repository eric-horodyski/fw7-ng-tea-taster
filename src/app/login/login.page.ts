import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  loginForm = this.fb.group({
    email: ['', [Validators.email, Validators.required]],
    password: ['', [Validators.required]],
  });

  get emailError(): string {
    const email = this.loginForm.controls.email;
    return email.errors?.['required'] ? 'Required' : email.errors?.['email'] ? 'Invalid format' : 'Unknown error';
  }

  get passwordError(): string {
    const password = this.loginForm.controls.password;
    return password.errors?.['required'] ? 'Required' : 'Unknown error';
  }

  constructor(private fb: FormBuilder) {}

  signIn() {
    console.log(this.loginForm.controls.email.value, this.loginForm.controls.password.value);
  }
}
