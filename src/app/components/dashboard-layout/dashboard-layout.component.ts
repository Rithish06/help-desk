import { Component, ViewChild, ElementRef, AfterViewInit, Input } from '@angular/core';

@Component({
  selector: 'app-dashboard-layout',
  templateUrl: './dashboard-layout.component.html',
  styleUrls: ['./dashboard-layout.component.css'] // Note: styleUrl -> styleUrls (array)
})
export class DashboardLayoutComponent implements AfterViewInit{
  @ViewChild('navigatorRef') navigatorMargin!: ElementRef<HTMLElement>;

  isAllTicket: boolean = false;
  isNewTicket: boolean = false;
  isOnGoingTicket: boolean = false;
  isResolved: boolean = false;
  isQuickForm : boolean = false

  @Input() sectionName:any

  ngOnInit(){
    console.log(this.sectionName)
  }

  ngAfterViewInit() {
    // Set initial styles after the view is initialized
    if (this.navigatorMargin) {
      this.navigatorMargin.nativeElement.style.transition = '0.5s'; // Add transition
    }
  }

  activateAllTicket(): void {
    this.isAllTicket = true;
    this.isNewTicket = false;
    this.isOnGoingTicket = false;
    this.isResolved = false;
    if (this.navigatorMargin) {
      this.navigatorMargin.nativeElement.style.marginLeft = '0px';
      this.navigatorMargin.nativeElement.style.transition = '0.5s';
    }
  }

  activateNewTicket(): void {
    this.isAllTicket = false;
    this.isNewTicket = true;
    this.isOnGoingTicket = false;
    this.isResolved = false;
    if (this.navigatorMargin) {
      this.navigatorMargin.nativeElement.style.marginLeft = '200px';
      this.navigatorMargin.nativeElement.style.transition = '0.5s';
    }
  }

  activateOnGoingTicket(): void {
    this.isAllTicket = false;
    this.isNewTicket = false;
    this.isOnGoingTicket = true;
    this.isResolved = false;
    if (this.navigatorMargin) {
      this.navigatorMargin.nativeElement.style.marginLeft = '400px';
      this.navigatorMargin.nativeElement.style.transition = '0.5s';
    }
  }

  activateResolvedTicket(): void {
    this.isAllTicket = false;
    this.isNewTicket = false;
    this.isOnGoingTicket = false;
    this.isResolved = true;
    if (this.navigatorMargin) {
      this.navigatorMargin.nativeElement.style.marginLeft = '600px';
      this.navigatorMargin.nativeElement.style.transition = '0.5s';
    }
  }

  tickets : any = [
    {
      id : '1',
      color : '#F8A53499',
      ticketNumber : 'Ticket# 2025-CS123',
      ticketTime : '12:45',
      ticketPriority : 'High Priority',
      ticketQuery : 'How to deposit money to my portal?',
      ticketDescription : 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      profilePic: '../../../assets/userprofile.avif',
      profileName: 'Prabhu Deva'
    },
    {
      id : '2',
      color : '#F8A53499',
      ticketNumber : 'Ticket# 2025-CS123',
      ticketTime : '12:45',
      ticketQuery : 'How to deposit money to my portal?',
      ticketDescription : 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      profilePic: '../../../assets/userprofile.avif',
      profileName: 'Prabhu Deva'
    },
    {
      id : '3',
      color : '#F8A53499',
      ticketNumber : 'Ticket# 2025-CS123',
      ticketTime : '12:45',
      ticketQuery : 'How to deposit money to my portal?',
      ticketDescription : 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      profilePic: '../../../assets/userprofile.avif',
      profileName: 'Prabhu Deva'
    },
    {
      id : '4',
      color : '#F8A53499',
      ticketNumber : 'Ticket# 2025-CS123',
      ticketTime : '12:45',
      ticketQuery : 'How to deposit money to my portal?',
      ticketDescription : 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      profilePic: '../../../assets/userprofile.avif',
      profileName: 'Prabhu Deva'
    },
  ]

  displayQuickForm():void{
    this.isQuickForm = true
    console.log(this.isQuickForm, "quickform")
  }

  closeQuickForm(event:boolean):void{
    this.isQuickForm = event
  }
}