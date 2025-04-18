import { Component, Input } from '@angular/core';
import { HttpHeaders } from '@angular/common/http'
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-layout',
  templateUrl: './user-layout.component.html',
  styleUrl: './user-layout.component.css'
})

export class UserLayoutComponent {

  @Input() headers : any
  ticketFormName : any
  ticketHeading : any
  singleTicketName : any

  activateDashboard : boolean = true
  activateTicket : boolean = false
  activateSettings : boolean = false
  activateSingleTicket : boolean = false
  token : any

  isCancelLogout : boolean = true

  notificationBar : boolean = false

  constructor(private router : Router){}

  ngOnInit(){
    
    const role = localStorage.getItem('role')
    if(role === "admin"){
      this.router.navigate(['/admin']); 
    }

    this.notificationBar = false

  }

  sectionName : any
  importedSectionName(event:any):void{
    this.sectionName = ''
    this.sectionName = event

    if(this.sectionName === 'Tickets'){
      this.activateDashboard = false
      this.activateTicket = true
      this.activateSettings = false
      this.activateSingleTicket = false
    }
    else if(this.sectionName === 'Settings'){
      this.activateDashboard = false
      this.activateTicket = false
      this.activateSettings = true
      this.activateSingleTicket = false
    }
    else if(this.sectionName === 'singleTicket'){
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

  receiveTicketFormName(event:string):void{
    this.ticketFormName = event
    console.log()
  }

  receiveTicketHeading(event:string):void{
    this.ticketHeading = event
    console.log(this.ticketHeading, 'from userlayout')
  }

  receiveTicketData(e:any):void{
    this.singleTicketName = e
    this.notificationBar = false
    this.activateDashboard = false
    this.activateTicket = false
    this.activateSettings = false
    this.activateSingleTicket =true
  }

  // logOut

  cancelLogout(e:any):void{
    this.isCancelLogout = e
  }

  popUplogOut(e:any):void{
    this.isCancelLogout = e
  }

  // notificationBar

  activateNoticationBar(e:any){
    this.notificationBar = e
  }


}
