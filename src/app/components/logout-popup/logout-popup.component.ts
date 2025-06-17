import { Component, Output, EventEmitter } from '@angular/core';
import { Route, Router } from '@angular/router';
import { LocalstorageService } from '../../services/localstorage/localstorage.service';

@Component({
  selector: 'app-logout-popup',
  templateUrl: './logout-popup.component.html',
  styleUrl: './logout-popup.component.css'
})
export class LogoutPopupComponent {

  constructor(private router : Router, private storage : LocalstorageService){}

  @Output() isCancelLogOut = new EventEmitter<boolean>()

  cancel():void{
    this.isCancelLogOut.emit(true)
  }

  logOut():void{
    localStorage.clear()
    this.router.navigate(['/login'])
  }

}
