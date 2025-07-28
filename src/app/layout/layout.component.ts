import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Router } from '@angular/router';

@Component({
  selector: 'app-layout',
  standalone: false,
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {
  isSmallScreen = false;

  constructor(private breakpointObserver: BreakpointObserver,private router:Router ) {}

  ngOnInit() {
    this.breakpointObserver.observe([Breakpoints.Handset, Breakpoints.Tablet])
      .subscribe(result => {
        this.isSmallScreen = result.matches;
      });
  }

  toggleSidenav(sidenav: any) {
    sidenav.toggle();
  }

logout() {
  console.log("Logging out...");
  // Clear any session or local storage if needed
  localStorage.clear();
  // Redirect to login
  this.router.navigate(['/login']);
}

}
