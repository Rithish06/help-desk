import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-header-section',
  templateUrl: './header-section.component.html',
  styleUrl: './header-section.component.css'
})
export class HeaderSectionComponent {

  profilePic : any
  userName : any

  notificationBarController : boolean = false
  @Output() notificationBar = new EventEmitter<boolean>()

  ngOnInit(){
    this.profilePic = localStorage.getItem("profilePic")
    this.userName = localStorage.getItem("name")
  }

  activateNamebar():void{
    this.notificationBarController = !this.notificationBarController
    this.notificationBar.emit(this.notificationBarController)
  }
}