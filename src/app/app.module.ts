import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { SideBarComponent } from './components/side-bar/side-bar.component';
import { HeaderSectionComponent } from './components/header-section/header-section.component';
import { QuickTicketFormComponent } from './components/quick-ticket-form/quick-ticket-form.component';
import { NewTicketFormComponent } from './components/new-ticket-form/new-ticket-form.component';
import { UserLayoutComponent } from './pages/user-layout/user-layout.component';
import { DashboardLayoutComponent } from './components/dashboard-layout/dashboard-layout.component';
import { TicketLayoutComponent } from './components/ticket-layout/ticket-layout.component';
import { SettingsLayoutComponent } from './components/settings-layout/settings-layout.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SideBarComponent,
    HeaderSectionComponent,
    QuickTicketFormComponent,
    NewTicketFormComponent,
    UserLayoutComponent,
    DashboardLayoutComponent,
    TicketLayoutComponent,
    SettingsLayoutComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [
    provideClientHydration()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
