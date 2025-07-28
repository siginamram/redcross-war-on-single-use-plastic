import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  hide = true;
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }
onLogin() {
  if (this.loginForm.valid) {
    const { username, password } = this.loginForm.value;
    console.log('Login:', username, password);

    // Redirect to dashboard
    this.router.navigate(['/home/dashboards/admin-dashboard']);
  }
}
}
