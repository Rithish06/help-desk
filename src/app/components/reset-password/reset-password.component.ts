import { Component, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user/user.service';
import { PasswordService } from '../../services/password/password.service';
import { ToastrService } from 'ngx-toastr';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LocalstorageService } from '../../services/localstorage/localstorage.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent {
  
  activateSection : string = ''
  newPasswordVisible : boolean = false
  confirmPasswordVisible : boolean = false

  @Output() isCancelLogOut = new EventEmitter<boolean>()
  

  // input 

  clientName : any
  place : any
  emailId : any
  isInputDisabled : boolean = false
  
  // password

  newPassword : any
  confirmPassword : any

  constructor(private router:Router, private user : UserService, private password : PasswordService, private toastr : ToastrService, private snackBar: MatSnackBar, private storage : LocalstorageService
){}

  ngOnInit(){
    this.setActiveSection('account')
    this.emailId = this.storage.getItem("email")
    this.clientName = this.storage.getItem("name")
    this.place = this.storage.getItem("place")
  }

  setActiveSection(sectionName:any):void{
    this.activateSection = sectionName
  }

  toggleNewPasswordVisibility(): void {
    this.newPasswordVisible = !this.newPasswordVisible;
  }

  toggleConfirmPasswordVisibility(): void {
    this.confirmPasswordVisible = !this.confirmPasswordVisible;
  }

  logout(): void {
    this.isCancelLogOut.emit(false)
  }

  updateEmail(): void {
    const id = this.storage.getItem('id');
    const email = {
      email: this.emailId
    };

    const existingEmail = this.storage.getItem('email')
  
    // Email validation pattern (RFC 5322 compliant)
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  
    // Validate email format before API call
    if (!emailPattern.test(this.emailId)) {
      this.snackBar.open('Please enter a valid email (e.g., user@domain.com)', 'Close', {
        duration: 3000,
        verticalPosition: 'top',
        horizontalPosition: 'right',
        panelClass: ['error-snackbar']
      });
      return; // Stop execution if invalid
    }
  
    if(existingEmail !== email.email){
      this.user.updateUserEmail(id, email).subscribe(
        res => {
          console.log('Success:', res);
          this.snackBar.open('Email updated successfully!', 'Close', {
            duration: 3000,
            verticalPosition: 'top',
            horizontalPosition: 'right',
            panelClass: ['success-snackbar']
          });
    
          localStorage.clear();
          this.router.navigate(['/login']);
        },
        err => {
          console.error('Error:', err);
          this.snackBar.open('Failed to update email', 'Close', {
            duration: 3000,
            verticalPosition: 'top',
            horizontalPosition: 'right',
            panelClass: ['error-snackbar']
          });
        }
      );
    
      this.storage.setItem('email', email.email);
      this.isInputDisabled = false;
    }
    else{
      this.snackBar.open('Please enter a new email ID', 'Close', {
        duration: 3000,
        verticalPosition: 'top',
        horizontalPosition: 'right',
        panelClass: ['error-snackbar']
      });
    }
   
  }

  editEmail():void{
    this.isInputDisabled = true

  }

  cancelEmail():void{
    this.emailId = this.storage.getItem("email")
    this.isInputDisabled = false
 
    this.snackBar.open('Cancelled', 'Close', {
      duration: 3000,
      verticalPosition: 'top',    // 'bottom' also possible
      horizontalPosition: 'right', // 'center', 'left' also valid
      panelClass: 'error-snackbar'
    });
  }


}
