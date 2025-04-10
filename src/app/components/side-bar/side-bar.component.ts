import { Component, Output, EventEmitter } from '@angular/core';
import { SidebarService } from '../../services/sidebar/sidebar.service';
import { Router } from '@angular/router';

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
  @Output() formName : any = new EventEmitter<any>()
  @Output() formHeading : any = new EventEmitter<any>()

  // icons
  dashboardIcon :string = '../../../assets/Category.svg'
  ticketsIcon : string = '../../../assets/ticketstar.svg'
  settingsIcon : string = '../../../assets/setting.svg'

  // usertype
  userType : string | null = '' 

  ngOnInit(){
    this.userType = localStorage.getItem('role')
    this.onClickDashboard()
    this.changeTicketForm('product', 'Product')
  }

  constructor(private sidebar : SidebarService, private router:Router){}

  // pathNames : any[] = ['Product','Website','SEO','SMM','PPC']
  pathNames : any[] = [
    {
      name : 'Product',
      formName : "product",
    },
    {
      name : 'Website',
      formName : "website"
    },
    {
      name : 'SEO',
      formName : "website"
    },
    {
      name : 'SMM',
      formName : "website"
    },
    {
      name : 'PPC',
      formName : "website"
    },
  ]

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

  // activateSingleTicket(e:any):void{
  //   this.sectionName.emit(e)
  // }

  changeTicketForm(event:string, name:string):void{
    this.formName.emit(event)
    this.formHeading.emit(name)

    console.log(name, "from sidebar")
  }

  logout(): void {
    localStorage.removeItem('user'); // Remove user data from local storage
    localStorage.removeItem('token'); // Remove authentication token
    this.router.navigate(['/login']); // Redirect to login page
  }



}
