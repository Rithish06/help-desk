import { Component, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user/user.service';
import { PasswordService } from '../../services/password/password.service';
import { ToastrService } from 'ngx-toastr';
import { MatSnackBar } from '@angular/material/snack-bar';


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

  constructor(private router:Router, private user : UserService, private password : PasswordService, private toastr : ToastrService, private snackBar: MatSnackBar){}

  ngOnInit(){
    this.setActiveSection('account')
    this.emailId = localStorage.getItem("email")
    this.clientName = localStorage.getItem("name")
    this.place = localStorage.getItem("place")
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
    const id = localStorage.getItem('id');
    const email = {
      email: this.emailId
    };

    this.user.updateUserEmail(id, email).subscribe(
      res => {
        console.log('Success:', res);

        // this.snackBar.open('Email updated successfully!', 'Close', {
        //   duration: 3000,
        //   verticalPosition: 'top',    // 'bottom' also possible
        //   horizontalPosition: 'right', // 'center', 'left' also valid
        //   panelClass: ['success-snackbar']
        // });

        this.toastr.success('Email updated successfully!', 'Success', {timeOut : 2000});

        localStorage.clear()
        this.router.navigate(['/login'])
      },
      err => {
        console.error('Error:', err);
        // Show error toast
        this.snackBar.open('Failed to update email', 'Close', {
          duration: 3000,
          verticalPosition: 'top',    // 'bottom' also possible
          horizontalPosition: 'right', // 'center', 'left' also valid
          panelClass: ['error-snackbar']
        });
      }
    );


    localStorage.setItem('email', email.email);
    this.isInputDisabled = false;
  }

  editEmail():void{
    this.isInputDisabled = true

  }

  cancelEmail():void{
    this.emailId = localStorage.getItem("email")
    this.isInputDisabled = false
 
    this.snackBar.open('Cancelled', 'Close', {
      duration: 3000,
      verticalPosition: 'top',    // 'bottom' also possible
      horizontalPosition: 'right', // 'center', 'left' also valid
      panelClass: 'error-snackbar'
    });
  }


}
