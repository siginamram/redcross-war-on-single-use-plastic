import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';

const routes: Routes = [
  {path: '', redirectTo: 'auth/login', pathMatch: 'full' },
  {path: 'auth',loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)},

  { 
  path: 'home', component: LayoutComponent,
   children: 
    [
      { path: 'core', loadChildren: () => import('./features/core/core.module').then(m => m.CoreModule) },
      { path: 'dashboards', loadChildren: () => import('./features/dashboards/dashboards.module').then(m => m.DashboardsModule) },
    ]
  },
    { path: '**', redirectTo: 'auth/login' }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}