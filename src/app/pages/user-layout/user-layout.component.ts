import { Component, Input, ElementRef, ViewChild,Inject, PLATFORM_ID} from '@angular/core';
import { HttpHeaders } from '@angular/common/http'
import { Router } from '@angular/router';
import { LocalstorageService } from '../../services/localstorage/localstorage.service';
import { NotificationPopupComponent } from '../../components/notification-popup/notification-popup.component';
import { isPlatformBrowser } from '@angular/common';
@Component({
  selector: 'app-user-layout',
  templateUrl: './user-layout.component.html',
  styleUrl: './user-layout.component.css'
})

export class UserLayoutComponent {

  @Input() headers: any
  ticketFormName: any
  ticketHeading: any
  singleTicketName: any

  activateDashboard: boolean = true
  activateTicket: boolean = false
  activateSettings: boolean = false
  activateSingleTicket: boolean = false
  token: any

  private socket!: WebSocket;
  private isBrowser: boolean;

  isCancelLogout: boolean = true

  notificationBar: boolean = false

  constructor(private router: Router, private storage: LocalstorageService, @Inject(PLATFORM_ID) private platformId: Object) {this.isBrowser = isPlatformBrowser(platformId); }
  @ViewChild(NotificationPopupComponent) notificationComponent!: NotificationPopupComponent;

  ngOnInit() {

    const role = this.storage.getItem('role')
    if (role === "admin") {
      this.router.navigate(['/admin']);
    }

    this.setupWebSocket()

    this.notificationBar = false

  }

  sectionName: any
  importedSectionName(event: any): void {
    this.sectionName = ''
    this.sectionName = event

    if (this.sectionName === 'Tickets') {
      this.activateDashboard = false
      this.activateTicket = true
      this.activateSettings = false
      this.activateSingleTicket = false
    }
    else if (this.sectionName === 'Settings') {
      this.activateDashboard = false
      this.activateTicket = false
      this.activateSettings = true
      this.activateSingleTicket = false
    }
    else if (this.sectionName === 'singleTicket') {
      this.activateDashboard = false
      this.activateTicket = false
      this.activateSettings = false
      this.activateSingleTicket = true
    }
    else {
      this.activateDashboard = true
      this.activateTicket = false
      this.activateSettings = false
      this.activateSingleTicket = false
    }
  }

  receiveTicketFormName(event: string): void {
    this.ticketFormName = event
    console.log()
  }

  receiveTicketHeading(event: string): void {
    this.ticketHeading = event
    console.log(this.ticketHeading, 'from userlayout')
  }

  receiveTicketData(e: any): void {
    this.singleTicketName = e
    this.notificationBar = false
    this.activateDashboard = false
    this.activateTicket = false
    this.activateSettings = false
    this.activateSingleTicket = true
  }

  // logOut

  cancelLogout(e: any): void {
    this.isCancelLogout = e
  }

  popUplogOut(e: any): void {
    this.isCancelLogout = e
  }

  // notificationBar

  activateNoticationBar(e: any) {
    this.notificationBar = e
  }

  setupWebSocket(): void {
    this.socket = new WebSocket('ws://localhost:4000');

    this.socket.onopen = () => {
      console.log('✅ WebSocket connected');
    };

    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === 'updateStatus') {
        const { ticketNumber, title } = data.data;

        const styledMessage = `
        <div>
          <strong style="color: #0f172a;">🔔 New Ticket Created!</strong><br>
          <span style="color: #2563eb;">Ticket Number:</span> <strong>${ticketNumber}</strong><br>
          <span style="color: #2563eb;">Title:</span> ${title}
        </div>
      `;

        setTimeout(() => {
          this.notificationComponent?.show?.(styledMessage);
          this.playSound();
        }, 100); // Ensure component is rendered

        console.log(data, 'notified data');
      }
    };
  }

  playSound(): void {
    const audio = new Audio();
    audio.src = '../../../assets/audio/notification.mp3';
    audio.load();
    audio.play().catch(err => console.error('🔇 Sound error:', err));
  }
}
