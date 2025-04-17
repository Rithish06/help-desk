import { Component, ViewChild, ElementRef, AfterViewInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { TicketService } from '../../services/ticket/ticket.service';
import { convertUTCtoIST, formatDate, capitalizeFirstLetter, sortTicketsByDate } from '../../utils.fun';

@Component({
  selector: 'app-dashboard-layout',
  templateUrl: './dashboard-layout.component.html',
  styleUrls: ['./dashboard-layout.component.css'] // Note: styleUrl -> styleUrls (array)
})
export class DashboardLayoutComponent implements AfterViewInit, OnChanges {
  @ViewChild('navigatorRef') navigatorMargin!: ElementRef<HTMLElement>;
  @ViewChild('dateInput') dateInput!: ElementRef;

  isAllTicket: boolean = false;
  isNewTicket: boolean = false;
  isOnGoingTicket: boolean = false;
  isResolved: boolean = false;
  isQuickForm: boolean = false
  clientId: any

  searchText: String = ''
  selectedDate: any = ''
  selectedProductType: any = 'all'

  inputType: string = 'text';
  dateValue: string = '';

  @Output() singleTicket: any = new EventEmitter<any>()

  @Input() sectionName: any

  currentPage: number = 1;
  itemsPerPage: number = 5;
  paginatedTickets: any[] = [];
  totalPages: number = 1;

  constructor(private ticketService: TicketService) { }

  allTickets: any
  tickets: any
  role: any

  isLoading: boolean = false

  private currentFilters = {
    searchTerm: '',
    productType: 'all',
    date: '',
    status: 'all'
  };

  @Input() headers: any

  ticketFilterImages = {
    all: '../../../assets/all-tickets.svg',
    new: '../../../assets/new-ticket.svg',
    ongoing: '../../../assets/going-on-ticket.svg',
    resolved: '../../../assets/resolved-ticket.svg'
  }

  activateTicketFilterImages = {
    all: '../../../assets/activate-all-tickets.svg',
    new: '../../../assets/activate-new-ticket.svg',
    ongoing: '../../../assets/activate-on-going-ticket.svg',
    resolved: '../../../assets/activate-resolved-ticket.svg'
  }

  ngOnInit() {
    this.role = localStorage.getItem('role');
    this.clientId = localStorage.getItem('clientId');
    this.initFunction();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedProductType']) {
      this.currentFilters.productType = this.selectedProductType;
      this.applyFilters();
    }
  }

  openDatePicker() {
    this.dateInput.nativeElement.showPicker();
  }

  // Unified filter application
  private applyFilters(): void {
    if (!this.allTickets) return;

    let filtered = [...this.allTickets];

    // Apply status filter
    if (this.currentFilters.status !== 'all') {
      filtered = filtered.filter(entry => entry.status === this.currentFilters.status);
    }

    // Apply search filter
    if (this.currentFilters.searchTerm) {
      const searchTerm = this.currentFilters.searchTerm.toLowerCase();
      filtered = filtered.filter(entry =>
        entry.ticketId?.toLowerCase().includes(searchTerm) ||
        entry.title?.toLowerCase().includes(searchTerm) ||
        entry.clientName?.toLowerCase().includes(searchTerm)
      );
    }

    // Apply product type filter
    if (this.currentFilters.productType !== 'all') {
      filtered = filtered.filter(entry => entry.ticketFor === this.currentFilters.productType);
    }

    // Apply date filter
    if (this.currentFilters.date) {
      filtered = filtered.filter(entry => entry.createdDate === this.currentFilters.date);
    }

    this.tickets = sortTicketsByDate(filtered);
    this.currentPage = 1;
    this.paginateTickets();
  }
  
onDateSelect(event: any) {
  if (this.selectedDate) {
    this.currentFilters.date = this.selectedDate.split('T')[0];
    this.applyFilters();
  }
}

clearDate() {
  this.selectedDate = null;
  this.currentFilters.date = '';
  this.applyFilters();
}

  initFunction(): void {
    const role = localStorage.getItem("role")

    if (role === 'user') {
      console.log(this.headers, "from tikets")
      // api call
      this.ticketService.getTicketsById(this.clientId).subscribe({
        next: (data: any) => {
          this.isLoading = true
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
              ticketFor: capitalizeFirstLetter(entry?.ticketFor),
              productName: entry.productName
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
              user.clientStatus = "On-Going Ticket"
            }

            if (user.status === "resolved") {
              user.statusColor = "#54C104"
              user.textColor = "#54C104"
              user.bgColor = "#54C1041A"
              user.clientStatus = "Resolved Tickets"
            }
          })
          console.log(this.allTickets)
          this.activateByTab("all")
        },
        error: (error) => {
          console.log(error)
        },
        complete: () => {
          this.isLoading = false
        }

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
            productName: entry.productName
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
            user.clientStatus = "On-Going Ticket"
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
        this.activateByTab("all")
      })
    }
  }

  onRefresh(): void {
    // Reset all filters
    this.currentFilters = {
      searchTerm: '',
      productType: 'all',
      date: '',
      status: 'all'
    };

    // Reset UI
    this.isAllTicket = true;
    this.isNewTicket = false;
    this.isOnGoingTicket = false;
    this.isResolved = false;

    if (this.navigatorMargin) {
      this.navigatorMargin.nativeElement.style.marginLeft = '0px';
    }

    // Reset form controls
    if (this.dateInput) {
      this.dateInput.nativeElement.value = '';
    }
    this.searchText = '';
    this.selectedProductType = 'all';

    // Reload data
    this.initFunction();
  }


  ngAfterViewInit() {
    if (this.navigatorMargin) {
      this.navigatorMargin.nativeElement.style.transition = '0.5s'; // Add transition
    }
  }

  activateByTab(tab: string): void {
    // Update UI state
    this.isAllTicket = tab === "all";
    this.isNewTicket = tab === "raised";
    this.isOnGoingTicket = tab === "on-going";
    this.isResolved = tab === "resolved";

    // Update navigator position
    if (this.navigatorMargin) {
      const positions: { [key: string]: string } = {
        'all': '0px',
        'raised': '200px',
        'on-going': '400px',
        'resolved': '600px'
      };
      this.navigatorMargin.nativeElement.style.marginLeft = positions[tab] || '0px';
      this.navigatorMargin.nativeElement.style.transition = '0.5s';
    }

    // Update status filter
    this.currentFilters.status = tab === 'all' ? 'all' : tab;``
    this.applyFilters();
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
    this.currentFilters.searchTerm = event?.target?.value?.toLowerCase().trim();
    this.applyFilters();
  }

  dateOnchange(event: any): void {
    this.currentFilters.date = event.target.value;
    this.applyFilters();
  }

  displayQuickForm(): void {
    this.isQuickForm = true
    console.log(this.isQuickForm, "quickform")
  }

  closeQuickForm(event: boolean): void {
    this.isQuickForm = event
  }

  sendSingleTicketData(e: any) {
    const choosenTicket = this.allTickets.filter((entry: any) => e === entry.ticketId)
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

  focusDateInput() {
    this.dateInput.nativeElement.focus();
    this.dateInput.nativeElement.showPicker?.(); // shows the calendar popup (only works in some browsers)
  }

  getVisiblePages(): number[] {
    const pages: number[] = [];

    // Previous page
    if (this.currentPage > 1) {
      pages.push(this.currentPage - 1);
    }

    // Current page
    pages.push(this.currentPage);

    // Next page
    if (this.currentPage < this.totalPages) {
      pages.push(this.currentPage + 1);
    }

    return pages;
  }

  onSelectingTicketType(e: any): void {
    this.currentFilters.productType = e.target.value;
    this.applyFilters();
  }

}