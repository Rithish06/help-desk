import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-single-ticket',
  templateUrl: './single-ticket.component.html',
  styleUrl: './single-ticket.component.css'
})
export class SingleTicketComponent {

    @Input() ticket : any

    ngOnInit(){
      console.log(this.ticket, "from single")
    }
}
