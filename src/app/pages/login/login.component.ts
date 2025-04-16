import { Component } from '@angular/core';
import {AuthService} from '../../services/auth/auth.service'
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  constructor(private authService : AuthService, private router: Router, private snackBar: MatSnackBar){}

  email : string = ''
  password : string = ''
  newPasswordVisible : any

  emailOnChange(event:any):any{
    this.email = event.target.value
    console.log(this.email)
  }

  passwordOnChange(event:any):any{
    this.password = event.target.value
    console.log(this.password)
  }

  ngOnInit(){
    // setTimeout(() => {
    //   console.log(this.authService.getUserRole())
    // }, 1000)

    const token = localStorage.getItem('token')
    const role = localStorage.getItem('role')
    if(token){
      if (role === 'admin') {
        this.router.navigate(['/admin']); // Redirect to Adm in Dashboard
      } else {
        this.router.navigate(['/home']); // Redirect to User Dashboard
      }
    }

  }

  // login({ event }: { event: Event; }) {
  //   event.preventDefault()
  //   this.authService.login({ email: this.email, password: this.password }).subscribe({
  //     next: (response:any) => {
  //       document.cookie = `token=${response.token}; path=/;`; // Store token in cookie
  //       console.log('Login successful:', response);
  //       console.log(this.authService.getUserRole)
  //     },
  //     error: (err:any) => {
  //       console.error('Login failed:', err);
  //     }
  //   });
  // }

  toggleNewPasswordVisibility(): void {
    this.newPasswordVisible = !this.newPasswordVisible;
  }

  login(event: Event) {
    event.preventDefault(); // Prevent form reload

    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: (response:any) => {

        const currDate = new Date().getTime()
        // Redirect based on role
        // document.cookie = `token=${response.token}; path=/;`; // Store token in cookie
        localStorage.setItem('role', response.user.role); // Store role in localStorage
        localStorage.setItem('token', response.token); // Store role in localStorage
        localStorage.setItem('clientId', response.user.clientId); // Store role in localStorage
        localStorage.setItem('products', response.user.products);
        localStorage.setItem('profilePic', response.user.profilePic);
        localStorage.setItem('phoneNo', response.user.phoneNo);
        localStorage.setItem('email', response.user.email);
        localStorage.setItem('name', response.user.name);
        localStorage.setItem('id', response.user._id)
        localStorage.setItem('place', response.user.place)
        localStorage.setItem('ticketPrefix', response.user.ticketPrifix)
        localStorage.setItem('loginTime', currDate.toString())
        // console.log('Login successful:', response);
        console.log(response.user.role)

        this.snackBar.open('Login successfully!', 'Close', {
          duration: 3000,
          verticalPosition: 'top',    // 'bottom' also possible
          horizontalPosition: 'right', // 'center', 'left' also valid
          panelClass: ['custom-snackbar','success-snackbar']
        });

        if (response.user.role === 'admin') {
          this.router.navigate(['/admin']); // Redirect to Adm in Dashboard
        } else {
          this.router.navigate(['/home']); // Redirect to User Dashboard
        }        
      },

      
      error: (err) => {
        console.error('Login failed:', err);
        this.snackBar.open('Login Failed. Invalid Credentials', 'Close', {
          duration: 3000,
          verticalPosition: 'top',    // 'bottom' also possible
          horizontalPosition: 'right', // 'center', 'left' also valid
          panelClass: ['custom-snackbar','error-snackbar']
        });
      }
    });
  }

}
