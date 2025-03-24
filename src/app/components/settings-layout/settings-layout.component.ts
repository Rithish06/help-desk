import { Component } from '@angular/core';

@Component({
  selector: 'app-settings-layout',
  templateUrl: './settings-layout.component.html',
  styleUrl: './settings-layout.component.css'
})
export class SettingsLayoutComponent {

  activateSection : string = ''
  newPasswordVisible : boolean = false
  confirmPasswordVisible : boolean = false

  ngOnInit(){
    this.setActiveSection('account')
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

}
