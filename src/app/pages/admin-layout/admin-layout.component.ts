import { Component, Input, ElementRef, ViewChild,Inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { LocalstorageService } from '../../services/localstorage/localstorage.service';
import { UserService } from '../../services/user/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TicketService } from '../../services/ticket/ticket.service';
import { NotificationPopupComponent } from '../../components/notification-popup/notification-popup.component';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.css'
})
export class AdminLayoutComponent {

  @Input() headers: any
  ticketFormName: any
  ticketHeading: any
  singleTicketName: any

  private socket!: WebSocket;
  private isBrowser: boolean;

  activateDashboard: boolean = true
  activateTicket: boolean = false
  activateSettings: boolean = false
  activateSingleTicket: boolean = false
  token: any

  notificationBar: boolean = false

  isCancelLogout: boolean = true

  searchTerm: string = '';
  filteredUsers: any[] = [];
  usersDetails: any
  allUsersDetails: any

  @ViewChild('popupRef') popupRef!: ElementRef;

  constructor(private router: Router, private storage: LocalstorageService, private users: UserService, private snackBar: MatSnackBar, private ticket: TicketService, @Inject(PLATFORM_ID) private platformId: Object) { 
    this.isBrowser = isPlatformBrowser(platformId);
    
  }

   @ViewChild(NotificationPopupComponent) notificationComponent!: NotificationPopupComponent;

  ngOnInit() {

    const role = this.storage.getItem('role')
    if (role === "user") {
      this.router.navigate(['/home']);
    }

    this.notificationBar = false
    // console.log(this.notificationBar)

    this.users.getAllUsers().subscribe((data: any) => {
      try {
        this.allUsersDetails = data;        // full list backup
        this.usersDetails = [...data];      // currently displayed list
        console.log(data, "user details from dashboard")
      }
      catch (error) {
        console.log(error)
      }
    })

        if (this.isBrowser) {
      this.setupWebSocket();
    }
  }

  closenotificationBar(): void {
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

  // notificartion

  activateNoticationBar(e: any) {
    this.notificationBar = e
  }

  onSearchChange(): void {
    const term = this.searchTerm?.trim().toLowerCase();

    if (!term) {
      this.usersDetails = [...this.allUsersDetails]; // reset if empty
      return;
    }

    this.usersDetails = this.allUsersDetails.filter((user: any) =>
      user.name?.toLowerCase().includes(term) ||
      user.clientId?.toLowerCase().includes(term)
    );
  }

  ticketId: any
  openPopUp: any
  assignedToName : any

  getTicketId(ticketId: any) {
    this.ticketId = ticketId
  }

  popUp(event: any) {
    this.openPopUp = event
  }

  assignedTo(name: any) {
    console.log(name)
    this.assignedToName = name
    this.openPopUp = false

    this.ticket.updateAssignedTo(this.ticketId, name).subscribe({
      next: (response:any) => {
        console.log('Assigned successfully:', response);
        this.showSnackbar(`Ticket ${this.ticketId} assigned to ${name}`, 'success');
        // Optional: show success message or refresh data
      },
      error: (err:any) => {
        console.error('Error assigning user:', err);
        this.showSnackbar(`Failed to assign ${this.ticketId} to ${name}`, 'error');
        // Optional: show error toast or dialog
      }
    });
  }

  onDocumentClick(event: MouseEvent): void {
    const clickedInside = this.popupRef?.nativeElement.contains(event.target);
    if (!clickedInside) {
      this.openPopUp = false;
    }
  }

  private showSnackbar(message: string, type: 'success' | 'error' | 'info' = 'info'): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      verticalPosition: 'top',
      horizontalPosition: 'right',
      panelClass: [`${type}-snackbar`]
    });
  }

    setupWebSocket(): void {
    this.socket = new WebSocket('ws://localhost:4000');

    this.socket.onopen = () => {
      console.log('✅ WebSocket connected');
    };

    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === 'ticketCreated') {
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
