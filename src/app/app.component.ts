import { Component, OnInit, ViewChild, Inject, PLATFORM_ID } from '@angular/core';
import { AuthService } from './services/auth/auth.service';
import { NotificationPopupComponent } from './components/notification-popup/notification-popup.component';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  private socket!: WebSocket;
  private isBrowser: boolean;

  @ViewChild(NotificationPopupComponent) notificationComponent!: NotificationPopupComponent;

  constructor(
    private authService: AuthService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    this.authService.checkAutoLogout();

  }


}
