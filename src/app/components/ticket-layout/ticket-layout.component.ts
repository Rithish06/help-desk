import { Component, Input } from '@angular/core';
import { SidebarService } from '../../services/sidebar/sidebar.service';

@Component({
  selector: 'app-ticket-layout',
  templateUrl: './ticket-layout.component.html',
  styleUrl: './ticket-layout.component.css'
})
export class TicketLayoutComponent {


  @Input() formName : any
  @Input() fromHeading : any
  headingText : string = ''

  ngOnInit(){
    console.log(this.formName, "from ticket")
  } 

  // setHeadingText():void{
  //   if(this.fromHeading === 'Website'){
  //     this.headingText = ''
  //   }
  //   else if(this.fromHeading === 'Product'){
  //     this.headingText = ''
  //   }
  //   else if(this.fromHeading === 'SEO'){
  //     this.headingText = ''
  //   }
  //   else if(this.fromHeading === 'SMM'){
  //     this.headingText = ''
  //   }
  //   else if(this.fromHeading === 'PPC'){
  //     this.headingText = ''
  //   }
  //   else{
  //     this.headingText = ''
  //   }
  // }




}
