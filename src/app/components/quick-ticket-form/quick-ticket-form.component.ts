import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-quick-ticket-form',
  templateUrl: './quick-ticket-form.component.html',
  styleUrl: './quick-ticket-form.component.css'
})
export class QuickTicketFormComponent {

  @Output() closeForm = new EventEmitter<boolean>

  onclickClose():void{
    this.closeForm.emit(false)
  }


}
