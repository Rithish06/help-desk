import { Component } from '@angular/core';
import { AuthService } from './services/auth/auth.service';
import { HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'help-desk';
  headers : any

  constructor(private authService : AuthService){}


  ngOnInit(){
    this.authService.checkAutoLogout();
  }
}
