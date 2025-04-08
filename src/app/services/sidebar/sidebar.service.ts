import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  constructor() {}

  ticketFormName : any

  storeTicketName(ticketName:String){
    this.ticketFormName = ticketName
  }

  getTicketName():String{
    console.log(this.ticketFormName)
    return this.ticketFormName
  }
}
