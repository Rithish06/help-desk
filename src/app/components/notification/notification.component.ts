import { Component, ViewChild, ElementRef, AfterViewInit, Input, Output, EventEmitter } from '@angular/core';
import { TicketService } from '../../services/ticket/ticket.service';
import { convertUTCtoIST, formatDate, capitalizeFirstLetter, sortTicketsByDate } from '../../utils.fun'
import { PLATFORM_ID, Inject } from '@angular/core'
import { HttpHeaders } from '@angular/common/http'
import { error } from 'console';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.css'
})
export class NotificationComponent {

  constructor(private ticketService: TicketService, @Inject(PLATFORM_ID) private platformId: object) { }

  role : any

  ngOnInit() {
    this.role = localStorage.getItem('role')
    this.clientId = localStorage.getItem('clientId')
    this.initFunction()
  }

  clientId: any
  headers: any
  allTickets: any

  notificationTickets : any

  @Output() openTicket = new EventEmitter<any>() 
  @Output() closeNotification = new EventEmitter<boolean>() 

  initFunction(): void {
    const role = localStorage.getItem("role")

    if (role === 'user') {
      console.log(this.headers, "from tikets")
      // api call
      this.ticketService.getTicketsById(this.clientId).subscribe((data: any) => {
        console.log(data, "data service")
        this.allTickets = data.map((entry: any) => {
          return {
            ticketId: entry.ticketNumber,
            title: entry.title,
            description: entry.description,
            createdAt: convertUTCtoIST(entry.createdAt),
            createdDate: formatDate(entry.createdAt),
            menupath: entry.menuPath,
            module: entry.module,
            status: entry.status,
            updatedAt: convertUTCtoIST(entry.createdAt),
            updatedDate: formatDate(entry.createdAt),
            id: entry._id,
            profileImage: entry.userDetails?.profilePic,
            clientName: entry.userDetails?.name,
            attachment: entry?.attatchment,
            comment: entry?.comments,
            ticketCreatedTime: entry.createdAt,
            notification : entry.clientNotification
          }
        })

        this.allTickets.forEach((user: any) => {
          if (user.status === "raised") {
            user.statusColor = "#3B8AFF"
            user.textColor = '#7F56D8'
            user.bgColor = '#2C63BA1A'
            user.clientStatus = "New Ticket"
          }

          if (user.status === "on-going") {
            user.statusColor = "#F8A53499"
            user.textColor = "#FAC885"
            user.bgColor = "#FAC8851A"
            user.clientStatus = "On-Going Tickets"
          }

          if (user.status === "resolved") {
            user.statusColor = "#54C104"
            user.textColor = "#54C104"
            user.bgColor = "#54C1041A"
            user.clientStatus = "Resolved Tickets"
          }
        })
        console.log(this.allTickets), "all tickets"
        // this.activateByTab("all")
        this.loadNotifications()

      })
    }
    else {
      console.log(this.headers, "from tikets")
      // api call
      this.ticketService.getAllTickets().subscribe((data: any) => {
        console.log(data, "data service")
        this.allTickets = data.map((entry: any) => {
          return {
            ticketId: entry.ticketNumber,
            title: entry.title,
            description: entry.description,
            createdAt: convertUTCtoIST(entry.createdAt),
            createdDate: formatDate(entry.createdAt),
            menupath: entry.menuPath,
            module: entry.module,
            status: entry.status,
            updatedAt: convertUTCtoIST(entry.createdAt),
            updatedDate: formatDate(entry.createdAt),
            id: entry._id,
            profileImage: entry.userDetails?.profilePic,
            clientName: entry.userDetails?.name,
            attachment: entry?.attatchment,
            comment: entry?.comments,
            commentBy: entry?.commentedBy,
            adminPriority: entry?.clientPriority,
            adminStatus: entry?.adminStatus,
            ticketFor: capitalizeFirstLetter(entry?.ticketFor),
            ticketCreatedTime: entry.createdAt,
            notification : entry.adminNotification
          }
        })

        this.allTickets.forEach((user: any) => {
          if (user.status === "raised") {
            user.statusColor = "#3B8AFF"
            user.textColor = '#7F56D8'
            user.bgColor = '#2C63BA1A'
            user.clientStatus = "New Ticket"
          }

          if (user.status === "on-going") {
            user.statusColor = "#F8A53499"
            user.textColor = "#FAC885"
            user.bgColor = "#FAC8851A"
            user.clientStatus = "On-Going Tickets"
          }

          if (user.status === "resolved") {
            user.statusColor = "#54C104"
            user.textColor = "#54C104"
            user.bgColor = "#54C1041A"
            user.clientStatus = "Resolved Tickets"
          }

          if (user.adminPriority === "low") {
            user.priorTextColor = '#FFD722'
            user.priorBgColor = '#FFFBE9'
            user.priorText = 'Low Priority'
          }

          if (user.adminPriority === "medium") {
            user.priorTextColor = '#FB9C2A'
            user.priorBgColor = '#FFF6EA'
            user.priorText = 'Mid Priority'
          }

          if (user.adminPriority === "high") {
            user.priorTextColor = '#FF0000'
            user.priorBgColor = '#FEF1F3'
            user.priorText = 'High Priority'
          }

          if (user.adminStatus === 'In dev') {
            user.adminStatusColor = '#5C211B'
            user.adminStatusBgColor = '#5C211B33'
            user.adminStatusText = 'In Dev'
          }

          if (user.adminStatus === 'Dev done') {
            user.adminStatusColor = '#EB6327'
            user.adminStatusBgColor = '#EB632733'
            user.adminStatusText = 'Dev done'
          }

          if (user.adminStatus === 'In QA') {
            user.adminStatusColor = '#DABD47'
            user.adminStatusBgColor = '#DABD4733'
            user.adminStatusText = 'In QA'
          }

          if (user.adminStatus === 'QA Done') {
            user.adminStatusColor = '#FFAD00'
            user.adminStatusBgColor = '#FFAD0033'
            user.adminStatusText = 'QA Done'
          }

          if (user.adminStatus === 'Deployed') {
            user.adminStatusColor = '#344E73'
            user.adminStatusBgColor = '#344E7333'
            user.adminStatusText = 'Deployed'
          }

          if (user.adminStatus === 'Resolved') {
            user.adminStatusColor = '#45A200'
            user.adminStatusBgColor = '#45A20033'
            user.adminStatusText = 'Resolved'
          }
        })
        console.log(this.allTickets)
        // this.activateByTab("all")
        this.loadNotifications()

      })
    }

    // if(this.allTickets){

    // }
  }

  loadNotifications():void{
    const role = localStorage.getItem('role')

    if(role === 'user'){
      const nt = this.allTickets.filter((entry:any) => entry.notification === true)

      this.notificationTickets = nt.map((entry:any) => {
        return{
          title : "Ticket Status Updated",
          description : `Dear ${entry.clientName} your ticket <b>${entry.ticketId}</b> status has been updated to <b>${entry.status}</b>.`,
          time : `${entry.createdDate} | ${entry.createdAt}`,
          id : entry.ticketId
        }
      })
    }
    else if(role === 'admin'){
      const nt = this.allTickets.filter((entry:any) => entry.notification === true)

      this.notificationTickets = nt.map((entry:any) => {
        return{
          title : "New Ticket Raised",
          description : `${entry.clientName} has raised a new ticket – <b>${entry.ticketId}</b>. Please review the details.`,
          time : `${entry.createdDate} | ${entry.createdAt}`,
          id : entry.ticketId
        }
      })
    } 

    console.log(this.notificationTickets, "notification tickets")
  }

  openTickets(ticketNumber:any):void{
      const filtredTicket = this.allTickets.filter((entry:any) => entry.ticketId === ticketNumber)
      this.openTicket.emit(filtredTicket)
      this.closeNotification.emit(false)

      if(this.openTicket){
        if(this.role === 'admin'){
          this.ticketService.updateAdminNotification(ticketNumber).subscribe(
            res => console.log('sent'),
            error => console.log(error)
          )
        }
        else{
          this.ticketService.updateClientNotification(ticketNumber).subscribe(
            res => console.log(res),
            error => console.log(error)
          )
        }
      }
  }  

}
