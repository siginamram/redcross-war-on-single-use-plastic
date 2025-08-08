import { Component,OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthApiService } from '../services/auth-api.service';
import { AlertDialogComponent } from '../../shared/components/alert-dialog/alert-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  hide = true;
  loginForm: FormGroup;
  showSpinner: boolean = false;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private dialog: MatDialog,
    private authApiService: AuthApiService
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }
  ngOnInit() {
    this.disableBrowserNavigation();
  }
 onLogin(): void {
  if (this.loginForm.valid) {
    this.showSpinner = true;
    const { username, password } = this.loginForm.value;

    // This is the correct payload
    const loginPayload = {
        username: username,
        password: password
    };

    this.authApiService.userLogin(loginPayload).subscribe({
      next: (response) => {
        this.showSpinner = false;

        // Store required data in localStorage
        localStorage.setItem('token', response.token);
        localStorage.setItem('username', response.username);
        localStorage.setItem('role', JSON.stringify(response.roleName));
        localStorage.setItem('roleID', JSON.stringify(response.roleID));
        localStorage.setItem('fullName', response.fullName);
        localStorage.setItem('email', response.email);
        localStorage.setItem('schoolID',JSON.stringify(response.schoolID));
        localStorage.setItem('districtID',JSON.stringify(response.districtID));
        localStorage.setItem('cityID',JSON.stringify(response.cityID));
        localStorage.setItem('zoneID',JSON.stringify(response.zoneID));
        localStorage.setItem('clusterId',JSON.stringify(response.clusterId));
        localStorage.setItem('volunteerId', JSON.stringify(response.volunteerId));

              // Navigate based on the role
          this.navigateBasedOnRole(response.roleID);
      },
      error: (err) => {
        this.showSpinner = false;
       this.openAlertDialog(
            'Error',
            'Invalid Login Credentials. Please try again.',
            'error'
          );
        console.error('Login failed:', err);
      }
    });
  }
}

  navigateBasedOnRole(roleID: number) {

    // Dynamically navigate based on roleID
    const routes: { [key: number]: string } = {
      1: '/home/dashboards/admin-dashboard',
      2: '/home/dashboards/school-dashboard',
      3: '/home/dashboards/volunteer-dashboard',
      4: '/home/dashboards/admin-dashboard',
      5: '/home/dashboards/admin-dashboard', 
      6: '/home/dashboards/admin-dashboard',
   
    };

    const route = routes[roleID] || '/home/dashboard';
    console.log(`Navigating to ${route}`);
    this.router.navigateByUrl(route);
  }
  
    openAlertDialog(title: string, message: string, type: string): void {
    this.dialog.open(AlertDialogComponent, {
      width: '400px',
      data: {
        title,
        message,
        type,
      },
    });
  }

disableBrowserNavigation(): void {
    // Prevent back navigation
    history.pushState(null, '', window.location.href);

    window.onpopstate = () => {
      history.pushState(null, '', window.location.href);
    };

    // Prevent forward navigation
    window.onunload = () => {
      history.replaceState(null, '', window.location.href);
    };
  }

}
