import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.css'
})
export class AdminLayoutComponent {

  constructor(private router : Router){}

  ngOnInit(){

    const role = localStorage.getItem('role')
    if(role === 'user'){
      this.router.navigate(['/home'])
    }
  }
}
