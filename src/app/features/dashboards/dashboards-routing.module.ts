import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardsComponent } from './dashboards.component';
import { SchoolDashboardComponent } from './components/school-dashboard/school-dashboard.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { ZoneDashboardComponent } from './components/zone-dashboard/zone-dashboard.component';

const routes: Routes = [
  {
    path: '', component: DashboardsComponent ,
    children: [
     { path: 'school-dashboard', component: SchoolDashboardComponent },
     { path: 'admin-dashboard', component: AdminDashboardComponent },
     { path: 'zone-dashboard', component: ZoneDashboardComponent },
    ]
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardsRoutingModule { }
