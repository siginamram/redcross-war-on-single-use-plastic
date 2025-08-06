import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Router } from '@angular/router';
import { RoleService } from '../shared/services/role.service';

@Component({
  selector: 'app-layout',
  standalone: false,
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {
  isSmallScreen = false;
  userName: string = localStorage.getItem('fullName') || 'User';
  userRoles: string[] = [];
  roleID: number | null = null;
  menuItems: any[] = [];

  constructor(private breakpointObserver: BreakpointObserver,
    private router:Router,
    public roleService: RoleService
   ) {}

  ngOnInit() {
    this.breakpointObserver.observe([Breakpoints.Handset, Breakpoints.Tablet])
      .subscribe(result => {
        this.isSmallScreen = result.matches;
      });

      // Retrieve user roles from local storage
    const storedUserRoles = localStorage.getItem('role');
    if (storedUserRoles) {
      this.userRoles = JSON.parse(storedUserRoles);
      this.roleService.setUserRoles(this.userRoles);
    }
      // Retrieve RoleId from localStorage
      const roleIdString = localStorage.getItem('roleID');
      if (roleIdString) {
      this.roleID = +roleIdString;
      this.setMenuItems(this.roleID);  // This sets menuItems
      }
  }
  setMenuItems(roleID: any): void {
    if (roleID === 1) {
      this.menuItems = [
        { title: 'Dashboard', icon: 'home', route: '/home/dashboards/admin-dashboard' },
      ];
    }
    else if (roleID === 2) {
      this.menuItems = [
        { title: 'Dashboard', icon: 'home', route: '/home/dashboards/school-dashboard' },
      ];
    }
    else if (roleID === 3) {
      this.menuItems = [
        { title: 'Dashboard', icon: 'home', route: '/home/dashboards/volunteer-dashboard' },
      ];  
    }
     else {
      this.menuItems = [
        { title: 'Dashboard', icon: 'home', route: '/home/dashboards/guest-dashboard' },
      ];
    }
  }

  toggleSidenav(sidenav: any) {
    sidenav.toggle();
  }

logout() {
sessionStorage.removeItem('isLoggedIn');

    // Clear session and local storage
    sessionStorage.clear();
    localStorage.clear();
    document.cookie = "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    // Redirect to login page and reload
    this.router.navigate(['/login']).then(() => {
      window.location.reload();
    });
}

}
