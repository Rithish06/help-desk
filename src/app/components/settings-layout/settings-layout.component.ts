import { Component, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user/user.service';
import { PasswordService } from '../../services/password/password.service';
import { error } from 'console';
import { ToastrService } from 'ngx-toastr';
import { MatSnackBar } from '@angular/material/snack-bar';



@Component({
  selector: 'app-settings-layout',
  templateUrl: './settings-layout.component.html',
  styleUrl: './settings-layout.component.css'
})
export class SettingsLayoutComponent {

  activateSection : string = ''
  newPasswordVisible : boolean = false
  confirmPasswordVisible : boolean = false

  // input 

  clientName : any
  place : any
  emailId : any
  isInputDisabled : boolean = false
  
  // password

  newPassword : any
  confirmPassword : any

  constructor(private router:Router, private user : UserService, private password : PasswordService, private toastr: ToastrService, private snackBar: MatSnackBar){}

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
    localStorage.removeItem('user'); // Remove user data from local storage
    localStorage.removeItem('token'); // Remove authentication token
    this.router.navigate(['/login']); // Redirect to login page
  }

  updateEmail(): void {
    const id = localStorage.getItem('id');
    const email = {
      email: this.emailId
    };

    // this.user.updateUserEmail(id, email).subscribe(
    //   res => {
    //     console.log('Success:', res);
    //     // Show success toast
    //     this.toastr.success('Email updated successfully!', 'Success');
    //   },
    //   err => {
    //     console.error('Error:', err);
    //     // Show error toast
    //     this.toastr.error('Failed to update email. Please try again.', 'Error');
    //   }
    // );

    this.toastr.success('Email updated successfully!', 'Success');

    localStorage.setItem('email', email.email);
    this.isInputDisabled = false;
  }

  editEmail():void{
    this.isInputDisabled = true
  }

  cancelEmail():void{
    this.emailId = localStorage.getItem("email")
    this.isInputDisabled = false
  }

  // resetPassword

  resetPassword(): void {
    if (this.newPassword === this.confirmPassword) {
      const id = localStorage.getItem("id");
      const password = this.confirmPassword;
  
      this.password.resetPassword(password, id).subscribe({
        next: (res) => {
          console.log("Success:", res)
          this.newPassword = ''
          this.confirmPassword = ''

          this.snackBar.open('Your password has been reset successfully', 'Close', {
            duration: 3000,
            verticalPosition: 'top',    // 'bottom' also possible
            horizontalPosition: 'right', // 'center', 'left' also valid
            // panelClass: ['success-snackbar']
          });
          
        },
        error: (err) => console.error("Error:", err)
      });
    } else {
      console.log("Password mismatch");

      this.snackBar.open('mismatch first and last password', 'Close', {
        duration: 3000,
        verticalPosition: 'top',    // 'bottom' also possible
        horizontalPosition: 'right', // 'center', 'left' also valid
        // panelClass: ['success-snackbar']
      });
    }
  }

  clearPassword():void{
    this.newPassword = ''
    this.confirmPassword = ''
  }

  // logOut
  @Output() isCancelLogOut = new EventEmitter<any>()
  

  logoutPopup(e:any):void{
    this.isCancelLogOut.emit(e)
  }

}
