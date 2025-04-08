import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'; // Import FormsModule

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { SideBarComponent } from './components/side-bar/side-bar.component';
import { HeaderSectionComponent } from './components/header-section/header-section.component';
import { QuickTicketFormComponent } from './components/quick-ticket-form/quick-ticket-form.component';
import { UserLayoutComponent } from './pages/user-layout/user-layout.component';
import { DashboardLayoutComponent } from './components/dashboard-layout/dashboard-layout.component';
import { TicketLayoutComponent } from './components/ticket-layout/ticket-layout.component';
import { SettingsLayoutComponent } from './components/settings-layout/settings-layout.component';
import { SingleTicketComponent } from './components/single-ticket/single-ticket.component';
import { HttpClientModule } from '@angular/common/http';
import { AdminLayoutComponent } from './pages/admin-layout/admin-layout.component';
import { AuthInterceptor } from './auth.interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { MaintenanceComponent } from './maintenance/maintenance.component';
import { WesiteFormComponent } from './components/wesite-form/wesite-form.component';
import { ProductFormComponent } from './components/product-form/product-form.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SideBarComponent,
    HeaderSectionComponent,
    QuickTicketFormComponent,
    UserLayoutComponent,
    DashboardLayoutComponent,
    TicketLayoutComponent,
    SettingsLayoutComponent,
    SingleTicketComponent,
    AdminLayoutComponent,
    MaintenanceComponent,
    WesiteFormComponent,
    ProductFormComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule

  ],
  providers: [
    provideClientHydration(),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
