import { Component } from '@angular/core';

@Component({
  selector: 'app-header-section',
  templateUrl: './header-section.component.html',
  styleUrl: './header-section.component.css'
})
export class HeaderSectionComponent {

  profilePic : any
  userName : any

  ngOnInit(){
    this.profilePic = localStorage.getItem("profilePic")
    this.userName = localStorage.getItem("name")
  }
}
