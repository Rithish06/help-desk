import { Component, ViewChild, ElementRef, AfterViewInit, Input, Output, EventEmitter, OnChanges, SimpleChanges, DoCheck } from '@angular/core';
import { TicketService } from '../../services/ticket/ticket.service';
import { convertUTCtoIST, formatDate, capitalizeFirstLetter, sortTicketsByDate } from '../../utils.fun';
import { SocketService } from '../../services/notification/notification.service';
import { LocalstorageService } from '../../services/localstorage/localstorage.service';
import { UserService } from '../../services/user/user.service';

@Component({
  selector: 'app-dashboard-layout',
  templateUrl: './dashboard-layout.component.html',
  styleUrls: ['./dashboard-layout.component.css'] // Note: styleUrl -> styleUrls (array)
})
export class DashboardLayoutComponent implements AfterViewInit, OnChanges, DoCheck {
  @ViewChild('navigatorRef') navigatorMargin!: ElementRef<HTMLElement>;
  @ViewChild('dateInput') dateInput!: ElementRef;

  isAllTicket: boolean = false;
  isNewTicket: boolean = false;
  isOnGoingTicket: boolean = false;
  isResolved: boolean = false;
  isQuickForm: boolean = false;
  Prev: boolean = false;
  Next: boolean = false;

  clientId: any

  searchText: String = ''
  selectedDate: any = ''
  selectedProductType: any = 'all'

  inputType: string = 'text';
  dateValue: string = '';



  @Output() singleTicket: any = new EventEmitter<any>()
  @Output() ticketId: any = new EventEmitter<any>()
  @Output() openPopUpAssign: any = new EventEmitter<any>()

  @Input() sectionName: any
  @Input() assignedToName!: string;
  @Input() ticketIdAssign!: string;

  currentPage: number = 1;
  itemsPerPage: number = 10;
  paginatedTickets: any[] = [];
  totalPages: number = 1;
  private previousName: string = ''

  notificationTickets: any

  constructor(private ticketService: TicketService, private storage: LocalstorageService, private users: UserService) { }

  allTickets: any
  tickets: any
  role: any

  isLoading: boolean = false
  usersDetails: any

  searchTerm: string = '';
  filteredUsers: any[] = [];

  private currentFilters = {
    searchTerm: '',
    productType: 'all',
    date: '',
    status: 'all' as string[] | 'all',
    excludeStatus: [] as string[]
  };


  @Input() headers: any
  // @Input() assignedToName: any


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
    this.role = this.storage.getItem('role');
    this.clientId = this.storage.getItem('clientId');
    this.initFunction();


    // this.notificationInit()

    // Real-time socket notification
    // this.socket.onTicketNotification().subscribe((data: any) => {
    //   const isUser = this.role === 'user' && data.role === 'user';
    //   const isAdmin = this.role === 'admin' && data.role === 'admin';

    //   console.log("socket")

    //   if (isUser || isAdmin) {
    //     this.notificationTickets.unshift({
    //       title: data.type,
    //       description: data.message,
    //       time: new Date(data.time).toLocaleString(),
    //       id: data.ticketNumber

    //     });
    //     console.log("new notification received")
    //   }
    // });

    // this.playNotificationSound()
  }

  // notificationInit(): void {
  //   const role = this.storage.getItem("role")

  //   if (role === 'user') {
  //     console.log(this.headers, "from tikets")
  //     // api call
  //     this.ticketService.getTicketsById(this.clientId).subscribe((data: any) => {
  //       console.log(data, "data service")
  //       this.allTickets = data.map((entry: any) => {
  //         return {
  //           ticketId: entry.ticketNumber,
  //           title: entry.title,
  //           description: entry.description,
  //           createdAt: convertUTCtoIST(entry.createdAt),
  //           createdDate: formatDate(entry.createdAt),
  //           menupath: entry.menuPath,
  //           module: entry.module,
  //           status: entry.status,
  //           updatedAt: convertUTCtoIST(entry.createdAt),
  //           updatedDate: formatDate(entry.createdAt),
  //           id: entry._id,
  //           profileImage: entry.userDetails?.profilePic,
  //           clientName: entry.userDetails?.name,
  //           attachment: entry?.attatchment,
  //           comment: entry?.comments,
  //           ticketCreatedTime: entry.createdAt,
  //           notification: entry.clientNotification,
  //           ticketType: entry.ticketType ? entry.ticketType : '-',
  //           ticketSubType: entry.ticketSubType,
  //           lastlyRepliedBy: entry.lastlyRepliedBy
  //         }
  //       })

  //       this.allTickets.forEach((user: any) => {
  //         if (user.status === "raised") {
  //           user.statusColor = "#3B8AFF"
  //           user.textColor = '#7F56D8'
  //           user.bgColor = '#2C63BA1A'
  //           user.clientStatus = "New Ticket"
  //         }

  //         if (user.status === "on-going") {
  //           user.statusColor = "#F8A53499"
  //           user.textColor = "#FAC885"
  //           user.bgColor = "#FAC8851A"
  //           user.clientStatus = "On-Going Tickets"
  //         }

  //         if (user.status === "resolved") {
  //           user.statusColor = "#54C104"
  //           user.textColor = "#54C104"
  //           user.bgColor = "#54C1041A"
  //           user.clientStatus = "Resolved Tickets"
  //         }
  //       })
  //       console.log(this.allTickets), "all tickets"
  //       // this.activateByTab("all")
  //       this.loadNotifications()

  //     })
  //   }
  //   else {
  //     console.log(this.headers, "from tikets")
  //     // api call
  //     this.ticketService.getAllTickets().subscribe((data: any) => {
  //       console.log(data, "data service")
  //       this.allTickets = data.map((entry: any) => {
  //         return {
  //           ticketId: entry.ticketNumber,
  //           title: entry.title,
  //           description: entry.description,
  //           createdAt: convertUTCtoIST(entry.createdAt),
  //           createdDate: formatDate(entry.createdAt),
  //           menupath: entry.menuPath,
  //           module: entry.module,
  //           status: entry.status,
  //           updatedAt: convertUTCtoIST(entry.createdAt),
  //           updatedDate: formatDate(entry.createdAt),
  //           id: entry._id,
  //           profileImage: entry.userDetails?.profilePic,
  //           clientName: entry.userDetails?.name,
  //           attachment: entry?.attatchment,
  //           comment: entry?.comments,
  //           commentBy: entry?.commentedBy,
  //           adminPriority: entry?.clientPriority,
  //           adminStatus: entry?.adminStatus,
  //           ticketFor: capitalizeFirstLetter(entry?.ticketFor),
  //           ticketCreatedTime: entry.createdAt,
  //           notification: entry.adminNotification,
  //           ticketType: entry.ticketType ? entry.ticketType : '-',
  //           ticketSubType: entry.ticketSubType,
  //           lastlyRepliedBy: entry.lastlyRepliedBy
  //         }
  //       })

  //       this.allTickets.forEach((user: any) => {
  //         if (user.status === "raised") {
  //           user.statusColor = "#3B8AFF"
  //           user.textColor = '#7F56D8'
  //           user.bgColor = '#2C63BA1A'
  //           user.clientStatus = "New Ticket"
  //         }

  //         if (user.status === "on-going") {
  //           user.statusColor = "#F8A53499"
  //           user.textColor = "#FAC885"
  //           user.bgColor = "#FAC8851A"
  //           user.clientStatus = "On-Going Tickets"
  //         }

  //         if (user.status === "resolved") {
  //           user.statusColor = "#54C104"
  //           user.textColor = "#54C104"
  //           user.bgColor = "#54C1041A"
  //           user.clientStatus = "Resolved Tickets"
  //         }

  //         if (user.adminPriority === "low") {
  //           user.priorTextColor = '#FFD722'
  //           user.priorBgColor = '#FFFBE9'
  //           user.priorText = 'Low Priority'
  //         }

  //         if (user.adminPriority === "medium") {
  //           user.priorTextColor = '#FB9C2A'
  //           user.priorBgColor = '#FFF6EA'
  //           user.priorText = 'Mid Priority'
  //         }

  //         if (user.adminPriority === "high") {
  //           user.priorTextColor = '#FF0000'
  //           user.priorBgColor = '#FEF1F3'
  //           user.priorText = 'High Priority'
  //         }

  //         if (user.adminStatus === 'In dev') {
  //           user.adminStatusColor = '#5C211B'
  //           user.adminStatusBgColor = '#5C211B33'
  //           user.adminStatusText = 'In Dev'
  //         }

  //         if (user.adminStatus === 'Dev done') {
  //           user.adminStatusColor = '#EB6327'
  //           user.adminStatusBgColor = '#EB632733'
  //           user.adminStatusText = 'Dev done'
  //         }

  //         if (user.adminStatus === 'In QA') {
  //           user.adminStatusColor = '#DABD47'
  //           user.adminStatusBgColor = '#DABD4733'
  //           user.adminStatusText = 'In QA'
  //         }

  //         if (user.adminStatus === 'QA Done') {
  //           user.adminStatusColor = '#FFAD00'
  //           user.adminStatusBgColor = '#FFAD0033'
  //           user.adminStatusText = 'QA Done'
  //         }

  //         if (user.adminStatus === 'Deployed') {
  //           user.adminStatusColor = '#344E73'
  //           user.adminStatusBgColor = '#344E7333'
  //           user.adminStatusText = 'Deployed'
  //         }

  //         if (user.adminStatus === 'Resolved') {
  //           user.adminStatusColor = '#45A200'
  //           user.adminStatusBgColor = '#45A20033'
  //           user.adminStatusText = 'Resolved'
  //         }
  //       })
  //       console.log(this.allTickets)
  //       // this.activateByTab("all")
  //       this.loadNotifications()

  //     })
  //   }

  //   // if(this.allTickets){

  //   // }
  // }

  loadNotifications(): void {
    const role = this.storage.getItem('role')

    if (role === 'user') {
      const nt = this.allTickets.filter((entry: any) => entry.notification === true)

      this.notificationTickets = nt.map((entry: any) => {
        return {
          title: "Ticket Status Updated",
          description: `Dear ${entry.clientName} your ticket <b>${entry.ticketId}</b> status has been updated to <b>${entry.status}</b>.`,
          time: `${entry.createdDate} | ${entry.createdAt}`,
          id: entry.ticketId
        }
      })
    }
    else if (role === 'admin') {
      const nt = this.allTickets.filter((entry: any) => entry.notification === true)

      this.notificationTickets = nt.map((entry: any) => {
        return {
          title: "New Ticket Raised",
          description: `${entry.clientName} has raised a new ticket – <b>${entry.ticketId}</b>. Please review the details.`,
          time: `${entry.createdDate} | ${entry.createdAt}`,
          id: entry.ticketId
        }
      })
    }

    console.log(this.notificationTickets, "notification tickets")
  }

  playNotificationSound(): void {
    const audio = new Audio();
    audio.src = '../../../assets/audio/notification.mp3';
    audio.load();
    audio.play().catch(err => console.error('Audio playback failed:', err));
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedProductType']) {
      this.currentFilters.productType = this.selectedProductType;
      this.applyFilters();
    }
    if (
      changes['ticketIdAssign']?.currentValue &&
      changes['assignedToName']?.currentValue
      // changes['assignedToName']?.currentValue !== changes['assignedToName']?.previousValue
    ) {
      this.updateAssignedToTicket();
      console.log(this.assignedToName, "assigned ")
    }
  }

  updateAssignedToTicket(): void {
    if (!this.paginatedTickets) return;

    const targetTicket = this.paginatedTickets.find((t: any) => t.ticketId === this.ticketIdAssign);
    if (targetTicket) {
      targetTicket.assignedTo = this.assignedToName;
      console.log(`✅ Updated ticket ${targetTicket.ticketId} with assignedTo = ${this.assignedToName}`);
    } else {
      console.warn(`⚠️ Ticket not found for ID: ${this.ticketIdAssign}`);
    }
  }


  ngDoCheck() {
    if (this.assignedToName !== this.previousName) {
      this.previousName = this.assignedToName;
      // this.onAssignChange(this.ticketIdAssign, this.assignedToName);
      //   this.initFunction()
      // this.paginateTickets()

      this.updateAssignedToTicket()
      console.log(this.assignedToName, "assignned")
      console.log(this.ticketIdAssign, "id assigned")
    }
  }

  openDatePicker() {
    this.dateInput.nativeElement.showPicker();
  }

  private applyStyleMappings(tickets: any[]) {
    tickets.forEach((user: any) => {
      const status = user.status?.toLowerCase();

      // Status styling
      if (status === 'new' || status === 'raised') {
        user.statusColor = '#7F56D8';
        user.bgColor = 'rgba(127, 86, 216, 0.30)';
      } else if (status === 'closed' || status === 'resolved') {
        user.statusColor = '#56DB5D';
        user.bgColor = 'rgba(145, 250, 133, 0.30)';
      } else {
        user.statusColor = '#E28406';
        user.bgColor = 'rgba(250, 200, 133, 0.30)';
      }

      user.textColor = user.statusColor;
      user.clientStatus = user.status;

      // Priority styling
      switch (user.adminPriority) {
        case 'low':
        case 'Level 1':
          user.priorTextColor = '#E28400';
          user.priorBgColor = 'rgba(250, 200, 133, 0.50)';
          break;
        case 'medium':
        case 'Level 2':
          user.priorTextColor = '#00A908';
          user.priorBgColor = 'rgba(84, 193, 4, 0.30)';
          break;
        case 'high':
        case 'Level 3':
          user.priorTextColor = '#FF0000';
          user.priorBgColor = 'rgba(255, 0, 0, 0.30)';
          break;
      }

      // Admin Status styling
      switch (user.adminStatus) {
        case 'In dev':
          user.adminStatusColor = '#5C211B';
          user.adminStatusBgColor = '#5C211B33';
          user.adminStatusText = 'In Dev';
          break;
        case 'Dev done':
          user.adminStatusColor = '#EB6327';
          user.adminStatusBgColor = '#EB632733';
          user.adminStatusText = 'Dev done';
          break;
        case 'In QA':
          user.adminStatusColor = '#DABD47';
          user.adminStatusBgColor = '#DABD4733';
          user.adminStatusText = 'In QA';
          break;
        case 'QA Done':
          user.adminStatusColor = '#FFAD00';
          user.adminStatusBgColor = '#FFAD0033';
          user.adminStatusText = 'QA Done';
          break;
        case 'Deployed':
          user.adminStatusColor = '#344E73';
          user.adminStatusBgColor = '#344E7333';
          user.adminStatusText = 'Deployed';
          break;
        case 'Resolved':
          user.adminStatusColor = '#45A200';
          user.adminStatusBgColor = '#45A20033';
          user.adminStatusText = 'Resolved';
          break;
      }
    });
  }

  private applyFilters(): void {
    if (!this.allTickets) return;

    let filtered = [...this.allTickets];

    // Apply filters
    if (this.currentFilters.status !== 'all' && Array.isArray(this.currentFilters.status) && this.currentFilters.status.length > 0) {
      filtered = filtered.filter(entry => this.currentFilters.status.includes(entry.status));
    } else if (typeof this.currentFilters.status === 'string' && this.currentFilters.status !== 'all') {
      filtered = filtered.filter(entry => entry.status === this.currentFilters.status);
    }

    if (this.currentFilters.excludeStatus?.length) {
      filtered = filtered.filter(entry => !this.currentFilters.excludeStatus.includes(entry.status));
    }

    if (this.currentFilters.searchTerm) {
      const searchTerm = this.currentFilters.searchTerm.toLowerCase();
      filtered = filtered.filter(entry =>
        entry.ticketId?.toLowerCase().includes(searchTerm) ||
        entry.title?.toLowerCase().includes(searchTerm) ||
        entry.clientName?.toLowerCase().includes(searchTerm)
      );
    }

    if (this.currentFilters.productType !== 'all') {
      filtered = filtered.filter(entry => entry.ticketFor === this.currentFilters.productType);
    }

    if (this.currentFilters.date) {
      filtered = filtered.filter(entry => entry.createdDate === this.currentFilters.date);
    }

    // ✅ Apply styling to filtered tickets
    this.applyStyleMappings(filtered);

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
    const role = this.storage.getItem("role");

    if (role === 'user') {
      console.log(this.headers, "from tickets");

      this.ticketService.getTicketsById(this.clientId).subscribe({
        next: (data: any) => {
          this.isLoading = true;
          console.log(data, "data service");

          this.allTickets = data.map((entry: any) => ({
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
            productName: entry.productName,
            ticketType: entry.ticketType,
            ticketSubType: entry.ticketSubType,
            lastlyRepliedBy: entry.lastlyRepliedBy,
          }));

          this.allTickets.forEach((user: any) => {
            const status = user.status?.toLowerCase();

            if (status === 'new') {
              user.statusColor = "#7F56D8";
              user.bgColor = "rgba(127, 86, 216, 0.30)";
            } else if (status === 'closed') {
              user.statusColor = "#56DB5D";
              user.bgColor = "rgba(145, 250, 133, 0.30)";
            } else {
              user.statusColor = "#E28406";
              user.bgColor = "rgba(250, 200, 133, 0.30)";
            }

            user.textColor = user.statusColor;
            user.clientStatus = user.status;
          });

          console.log(this.allTickets);
          this.activateByTab("all");
        },
        error: (error) => {
          console.log(error);
        },
        complete: () => {
          this.isLoading = false;
        }
      });

    } else {
      console.log(this.headers, "from tickets");

      this.ticketService.getAllTickets().subscribe((data: any) => {
        console.log(data, "data service");

        this.allTickets = data.map((entry: any) => ({
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
          productName: entry.productName,
          ticketType: entry.ticketType,
          ticketSubType: entry.ticketSubType,
          lastlyRepliedBy: entry.lastlyRepliedBy,
          assignedTo: entry.assignedTo
        }));

        this.allTickets.forEach((user: any) => {
          // Status color
          const status = user.status?.toLowerCase();

          if (status === 'new') {
            user.statusColor = "#7F56D8";
            user.bgColor = "rgba(127, 86, 216, 0.30)";
          } else if (status === 'closed') {
            user.statusColor = "#56DB5D";
            user.bgColor = "rgba(145, 250, 133, 0.30)";
          } else {
            user.statusColor = "#E28406";
            user.bgColor = "rgba(250, 200, 133, 0.30)";
          }

          user.textColor = user.statusColor;
          user.clientStatus = user.status;

          // Priority styles
          if (user.adminPriority === "Level 1") {
            user.priorTextColor = '#E28400';
            user.priorBgColor = 'rgba(250, 200, 133, 0.50)';
            user.priorText = 'Level 1';
          } else if (user.adminPriority === "Level 2") {
            user.priorTextColor = '#00A908';
            user.priorBgColor = 'rgba(84, 193, 4, 0.30)';
            user.priorText = 'Level 2';
          } else if (user.adminPriority === "Level 3") {
            user.priorTextColor = '#FF0000';
            user.priorBgColor = 'rgba(255, 0, 0, 0.30)';
            user.priorText = 'Level 3';
          }

          // Admin status styles
          switch (user.adminStatus) {
            case 'In dev':
              user.adminStatusColor = '#5C211B';
              user.adminStatusBgColor = '#5C211B33';
              user.adminStatusText = 'In Dev';
              break;
            case 'Dev done':
              user.adminStatusColor = '#EB6327';
              user.adminStatusBgColor = '#EB632733';
              user.adminStatusText = 'Dev done';
              break;
            case 'In QA':
              user.adminStatusColor = '#DABD47';
              user.adminStatusBgColor = '#DABD4733';
              user.adminStatusText = 'In QA';
              break;
            case 'QA Done':
              user.adminStatusColor = '#FFAD00';
              user.adminStatusBgColor = '#FFAD0033';
              user.adminStatusText = 'QA Done';
              break;
            case 'Deployed':
              user.adminStatusColor = '#344E73';
              user.adminStatusBgColor = '#344E7333';
              user.adminStatusText = 'Deployed';
              break;
            case 'Resolved':
              user.adminStatusColor = '#45A200';
              user.adminStatusBgColor = '#45A20033';
              user.adminStatusText = 'Resolved';
              break;
          }
        });

        console.log(this.allTickets);
        this.activateByTab("all");
      });
    }
  }

  onAssignChange(newUser: string, ticketNumber: string): void {
    const ticket = this.allTickets.find((t: any) => t.ticketNumber === ticketNumber);
    if (ticket) {
      ticket.assignedTo = newUser;
    }
  }


  onRefresh(): void {
    // Reset all filters
    this.currentFilters = {
      searchTerm: '',
      productType: 'all',
      date: '',
      status: 'all' as string[] | 'all',
      excludeStatus: [] as string[]
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
    const normalizedTab = tab.toLowerCase();

    // Update UI state
    this.isAllTicket = normalizedTab === "all";
    this.isNewTicket = normalizedTab === "new";
    this.isOnGoingTicket = normalizedTab === "on-going";
    this.isResolved = normalizedTab === "resolved";
    this.Prev = normalizedTab === "prev";
    this.Next = normalizedTab === "next";

    // Update navigator position
    if (this.navigatorMargin) {
      const positions: { [key: string]: string } = {
        'all': '0px',
        'new': '200px',
        'on-going': '400px',
        'resolved': '600px'
      };
      this.navigatorMargin.nativeElement.style.marginLeft = positions[normalizedTab] || '0px';
      this.navigatorMargin.nativeElement.style.transition = '0.5s';
    }

    if (normalizedTab === 'all') {
      this.currentFilters.status = 'all';
      this.currentFilters.excludeStatus = [];
    } else if (normalizedTab === 'new') {
      this.currentFilters.status = ['New'];
      this.currentFilters.excludeStatus = [];
    } else if (normalizedTab === 'on-going') {
      this.currentFilters.excludeStatus = ['New', 'Complete', 'Closed'];
      this.currentFilters.status = [];
    } else if (normalizedTab === 'resolved') {
      this.currentFilters.status = ['Closed'];
      this.currentFilters.excludeStatus = [];
    }

    this.applyFilters();
  }


  searchTickets(event: any): void {
    this.currentFilters.searchTerm = event?.target?.value?.toLowerCase().trim();
    this.applyFilters();
  }

  imagePreview: string | ArrayBuffer | null = null;

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

    console.log(this.paginatedTickets, "paginateds")
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
    // Current page
    if (pages.push(this.currentPage)) {
      pages.push(this.totalPages);
    }
    return pages;
  }

  onSelectingTicketType(e: any): void {
    this.currentFilters.productType = e.target.value;
    this.applyFilters();
  }

  onSelectinOngoingStatus(e: any) {
    this.currentFilters.status = e.target.value;
    this.applyFilters();
  }

  assignTo(ticketId: any) {
    this.ticketId.emit(ticketId)
    this.openPopUpAssign.emit(true)
  }

}