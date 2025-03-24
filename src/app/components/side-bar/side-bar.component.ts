import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.css'
})
export class SideBarComponent {

  dashboard : boolean = false
  tickets : boolean = false
  settings : boolean = false

  // output
  @Output() sectionName : any = new EventEmitter<any>()

  // icons
  dashboardIcon :string = '../../../assets/Category.svg'
  ticketsIcon : string = '../../../assets/ticketstar.svg'
  settingsIcon : string = '../../../assets/setting.svg'

  ngOnInit(){
    this.onClickDashboard()
  }

  onclickLogo():void{
    window.open('https://inventionminds.com/')
  }

  onClickDashboard():void{
    this.dashboard = true
    this.tickets = false
    this.settings = false
    this.sectionName.emit("Dashboard")
  }

  onClickTickets():void{
    this.tickets = true
    this.dashboard = false
    this.settings = false
    this.sectionName.emit("Tickets")
  }

  onClickSettings():void{
    this.tickets = false
    this.dashboard = false
    this.settings = true
    this.sectionName.emit("Settings")
  }

}
