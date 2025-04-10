import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { TicketService } from '../../services/ticket/ticket.service'

@Component({
  selector: 'app-single-ticket',
  templateUrl: './single-ticket.component.html',
  styleUrl: './single-ticket.component.css'
})
export class SingleTicketComponent implements OnChanges {

    @Input() ticket : any
    isInputDisabled : boolean = false
    isSaveButton : boolean = false
    newComment : any

    userType : any
    userName : any

    constructor(private ticketService :TicketService){}

    ngOnInit(){
      this.userType = localStorage.getItem("role")
      this.userName = localStorage.getItem('name')
      console.log(this.ticket, "from single")
      this.commentInit()
    }

    ngOnChanges(changes: SimpleChanges): void {
      if(changes['ticket']){
        this.newComment = this.ticket[0]?.comment
      }
    }

    commentInit():void{
      if(this.newComment){
        this.isInputDisabled = false
        this.isSaveButton = false
      }
      else{
        this.isInputDisabled = true
        this.isSaveButton = false
      }
    }

    onclickEditComment():void{
      this.isInputDisabled = true
      this.isSaveButton = false
    }

    commentTextOnchange(e:any):void{
      if(e !== ''){
        this.isSaveButton = true
      }
      else{
        this.isSaveButton = false
      }
    }

    onClickEdit():void{
      this.isInputDisabled = true
    }

    postComment(tktId:any){
      const comment = {
        comment : this.newComment,
        commentedBy : this.userName
      }
      console.log(comment)
      const id = tktId
      this.ticketService.updateComment(comment, id).subscribe(
        res => console.log(res),
        err => console.log(err)
      )

      this.isSaveButton = false
      this.isInputDisabled = true
    }
}
