import { Component, ViewChild, ElementRef, AfterViewInit, Input, Output, EventEmitter } from '@angular/core';
import { TicketService } from '../../services/ticket/ticket.service';
import { formaTime, formatDate } from '../../utils.fun'
import { PLATFORM_ID, Inject } from '@angular/core'
import { HttpHeaders } from '@angular/common/http'

@Component({
  selector: 'app-dashboard-layout',
  templateUrl: './dashboard-layout.component.html',
  styleUrls: ['./dashboard-layout.component.css'] // Note: styleUrl -> styleUrls (array)
})
export class DashboardLayoutComponent implements AfterViewInit {
  @ViewChild('navigatorRef') navigatorMargin!: ElementRef<HTMLElement>;

  isAllTicket: boolean = false;
  isNewTicket: boolean = false;
  isOnGoingTicket: boolean = false;
  isResolved: boolean = false;
  isQuickForm: boolean = false
  clientId: any

  searchText: String = ''
  selectedDate: any

  @Output() singleTicket: any = new EventEmitter<any>()

  @Input() sectionName: any

  currentPage: number = 1;
  itemsPerPage: number = 5;
  paginatedTickets: any[] = [];
  totalPages: number = 1;

  constructor(private ticketService: TicketService, @Inject(PLATFORM_ID) private platformId: object) {}

  allTickets: any
  tickets: any

  @Input() headers: any

  ngOnInit() {

    this.clientId = localStorage.getItem('clientId')
    console.log(localStorage.getItem('clientId'))
    this.initFunction()

  }

  initFunction():void{
    const role = localStorage.getItem("role")

    if(role === 'user'){
      console.log(this.headers, "from tikets")
      // api call
      this.ticketService.getTicketsById(this.clientId).subscribe((data: any) => {
        console.log(data, "data service")
        this.allTickets = data.map((entry: any) => {
          return {
            ticketId: entry.ticketNumber,
            title: entry.title,
            description: entry.description,
            createdAt: formaTime(entry.createdAt),
            createdDate: formatDate(entry.createdAt),
            menupath: entry.menuPath,
            module: entry.module,
            status: entry.status,
            updatedAt: formaTime(entry.createdAt),
            updatedDate : formatDate(entry.createdAt),
            id: entry._id,
            profileImage: entry.userDetails?.profilePic,
            clientName: entry.userDetails?.name,
            attachment : entry?.attatchment,
            comment : entry?.comment
          }
        })
  
        this.allTickets.forEach((user: any) => {
          if (user.status === "raised") {
            user.statusColor = "#3B8AFF"
          }
  
          if (user.status === "on-going") {
            user.statusColor = "#F8A53499"
          }
  
          if (user.status === "resolved") {
            user.statusColor = "#54C104"
          }
        })
        console.log(this.allTickets)
        this.activateByTab("all")
      })
    }
    else{
      console.log(this.headers, "from tikets")
      // api call
      this.ticketService.getAllTickets().subscribe((data: any) => {
        console.log(data, "data service")
        this.allTickets = data.map((entry: any) => {
          return {
            ticketId: entry.ticketNumber,
            title: entry.title,
            description: entry.description,
            createdAt: formaTime(entry.createdAt),
            createdDate: formatDate(entry.createdAt),
            menupath: entry.menuPath,
            module: entry.module,
            status: entry.status,
            updatedAt: formaTime(entry.createdAt),
            updatedDate : formatDate(entry.createdAt),
            id: entry._id,
            profileImage: entry.userDetails?.profilePic,
            clientName: entry.userDetails?.name,
            attachment : entry?.attatchment,
            comment : entry?.comment,
            commentBy : entry?.commentedBy
          }
        })
  
        this.allTickets.forEach((user: any) => {
          if (user.status === "raised") {
            user.statusColor = "#3B8AFF"
          }
  
          if (user.status === "on-going") {
            user.statusColor = "#F8A53499"
          }
  
          if (user.status === "resolved") {
            user.statusColor = "#54C104"
          }
        })
        console.log(this.allTickets)
        this.activateByTab("all")
      })
    }
  }

  ngAfterViewInit() {
    if (this.navigatorMargin) {
      this.navigatorMargin.nativeElement.style.transition = '0.5s'; // Add transition
    }
  }

  activateByTab(tab: string): void {
    if (tab === "all") {
      this.isAllTicket = true;
      this.isNewTicket = false;
      this.isOnGoingTicket = false;
      this.isResolved = false;
      // animation
      if (this.navigatorMargin) {
        this.navigatorMargin.nativeElement.style.marginLeft = '0px';
        this.navigatorMargin.nativeElement.style.transition = '0.5s';
      }

      // data
      if (this.allTickets) {
        this.tickets = this.allTickets
      }

    }
    else if (tab === "new") {
      this.isAllTicket = false;
      this.isNewTicket = true;
      this.isOnGoingTicket = false;
      this.isResolved = false;
      if (this.navigatorMargin) {
        this.navigatorMargin.nativeElement.style.marginLeft = '200px';
        this.navigatorMargin.nativeElement.style.transition = '0.5s';
      }

      // data
      if (this.allTickets) {
        this.tickets = this.allTickets.filter((entry: any) => entry.status === 'raised')
      }
    }
    else if (tab === "ongoing") {
      this.isAllTicket = false;
      this.isNewTicket = false;
      this.isOnGoingTicket = true;
      this.isResolved = false;
      if (this.navigatorMargin) {
        this.navigatorMargin.nativeElement.style.marginLeft = '400px';
        this.navigatorMargin.nativeElement.style.transition = '0.5s';
      }

      // data
      if (this.allTickets) {
        this.tickets = this.allTickets.filter((entry: any) => entry.status === 'on-going')
      }
    }
    else if (tab === "resolved") {
      this.isAllTicket = false;
      this.isNewTicket = false;
      this.isOnGoingTicket = false;
      this.isResolved = true;
      if (this.navigatorMargin) {
        this.navigatorMargin.nativeElement.style.marginLeft = '600px';
        this.navigatorMargin.nativeElement.style.transition = '0.5s';
      }

      // data
      if (this.allTickets) {
        this.tickets = this.allTickets.filter((entry: any) => entry.status === 'resolved')
      }
    }
    else {
      console.log("invalid tab")
    }

    this.paginateTickets()
  }

  // tickets: any = [
  //   {
  //     id: '1',
  //     color: '#F8A53499',
  //     ticketNumber: 'Ticket# 2025-CS123',
  //     ticketTime: '12:45',
  //     ticketPriority: 'High Priority',
  //     ticketQuery: 'How to deposit money to my portal?',
  //     ticketDescription: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  //     profilePic: '../../../assets/userprofile.avif',
  //     profileName: 'Prabhu Deva'
  //   },
  //   {
  //     id: '2',
  //     color: '#F8A53499',
  //     ticketNumber: 'Ticket# 2025-CS123',
  //     ticketTime: '12:45',
  //     ticketQuery: 'How to deposit money to my portal?',
  //     ticketDescription: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  //     profilePic: '../../../assets/userprofile.avif',
  //     profileName: 'Prabhu Deva'
  //   },
  //   {
  //     id: '3',
  //     color: '#F8A53499',
  //     ticketNumber: 'Ticket# 2025-CS123',
  //     ticketTime: '12:45',
  //     ticketQuery: 'How to deposit money to my portal?',
  //     ticketDescription: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  //     profilePic: '../../../assets/userprofile.avif',
  //     profileName: 'Prabhu Deva'
  //   },
  //   {
  //     id: '4',
  //     color: '#F8A53499',
  //     ticketNumber: 'Ticket# 2025-CS123',
  //     ticketTime: '12:45',
  //     ticketQuery: 'How to deposit money to my portal?',
  //     ticketDescription: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  //     profilePic: '../../../assets/userprofile.avif',
  //     profileName: 'Prabhu Deva'
  //   },
  // ]

  searchTickets(event: any): void {
    const searchValue = event?.target?.value?.toLowerCase().trim(); // Ensure safe access

    if (!searchValue) {
      this.tickets = [...this.allTickets]; // Reset to all tickets if search is empty
      return;
    }

    this.activateByTab("all")

    this.tickets = this.allTickets.filter((entry: any) =>
      entry.ticketId?.toLowerCase().includes(searchValue) ||  // Search by ticket number
      entry.title?.toLowerCase().includes(searchValue) ||        // Search by title
      entry.clientName?.toLowerCase().includes(searchValue)      // Search by client name (if applicable)
    );

    this.paginateTickets()
  }

  dateOnchange(event: any): void {
    this.selectedDate = event.target.value
    console.log(event.target.value)
    this.tickets = this.allTickets.filter((entry: any) => entry.createdDate === this.selectedDate)
  }

  displayQuickForm(): void {
    this.isQuickForm = true
    console.log(this.isQuickForm, "quickform")
  }

  closeQuickForm(event: boolean): void {
    this.isQuickForm = event
  }

  sendSingleTicketData(e: any) {
    const choosenTicket = this.allTickets.filter((entry:any) => e === entry.ticketId)
    this.singleTicket.emit(choosenTicket)
  }

  paginateTickets(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
  
    this.paginatedTickets = this.tickets.slice(startIndex, endIndex);
    this.totalPages = Math.ceil(this.tickets.length / this.itemsPerPage);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.paginateTickets();
    }
  }
}