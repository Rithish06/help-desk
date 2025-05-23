import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

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

  activateDashboard: boolean = true
  activateTicket: boolean = false
  activateSettings: boolean = false
  activateSingleTicket: boolean = false
  token: any

  notificationBar: boolean = false

  isCancelLogout: boolean = true

  constructor(private router: Router) { }

  ngOnInit() {

    const role = localStorage.getItem('role')
    if (role === "user") {
      this.router.navigate(['/home']);
    }

    this.notificationBar = false
    // console.log(this.notificationBar)

  }

  closenotificationBar():void{
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



}
