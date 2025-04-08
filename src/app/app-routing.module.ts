import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from './auth.guard'

// components
import { LoginComponent } from './pages/login/login.component';
import { UserLayoutComponent } from './pages/user-layout/user-layout.component';
import { AdminLayoutComponent } from './pages/admin-layout/admin-layout.component';
import { MaintenanceComponent } from './maintenance/maintenance.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'home', component: UserLayoutComponent,canActivate: [authGuard] },
  { path: 'admin', component: AdminLayoutComponent, canActivate: [authGuard] },
  { path: 'maintenance', component: MaintenanceComponent, canActivate: [authGuard] },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }