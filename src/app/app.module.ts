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
import { AdminTicketComponentComponent } from './components/admin-ticket-component/admin-ticket-component.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ToastrModule } from 'ngx-toastr';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { LogoutPopupComponent } from './components/logout-popup/logout-popup.component';
import { NotificationComponent } from './components/notification/notification.component';
import { LoadingComponent } from './components/loading/loading.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { SeoFormComponent } from './components/seo-form/seo-form.component';
import { SmmFormComponent } from './components/smm-form/smm-form.component';
import { PpcFormComponent } from './components/ppc-form/ppc-form.component';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';



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
    AdminTicketComponentComponent,
    ResetPasswordComponent,
    LogoutPopupComponent,
    NotificationComponent,
    LoadingComponent,
    SeoFormComponent,
    SmmFormComponent,
    PpcFormComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    MatCardModule,
    MatTooltipModule,
    MatSnackBarModule,
    ToastModule,
    ToastrModule.forRoot(
      {
        timeOut: 3000,
        positionClass: 'toast-top-right',
        preventDuplicates: true,
      }
    ),
    NgMultiSelectDropDownModule.forRoot()
  ],
  providers: [
    provideClientHydration(),
    MessageService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    provideAnimationsAsync(),
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
