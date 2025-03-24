import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-user-layout',
  templateUrl: './user-layout.component.html',
  styleUrl: './user-layout.component.css'
})
export class UserLayoutComponent {

  activateDashboard : boolean = true
  activateTicket : boolean = false
  activateSettings : boolean = false

  sectionName : any
  importedSectionName(event:any):void{
    this.sectionName = ''
    this.sectionName = event

    if(this.sectionName === 'Tickets'){
      this.activateDashboard = false
      this.activateTicket = true
      this.activateSettings = false
    }
    else if(this.sectionName === 'Settings'){
      this.activateDashboard = false
      this.activateTicket = false
      this.activateSettings = true
    }
    else {
      this.activateDashboard = true
      this.activateTicket = false
      this.activateSettings = false
    }
  }

  

}
