import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-notification-popup',
  templateUrl: './notification-popup.component.html',
  styleUrl: './notification-popup.component.css'
})
export class NotificationPopupComponent {
  @Input() message: string | null = null;
  visible = false;

  // ✅ This must be public
  public show(message: string): void {
    this.message = message;
    this.visible = true;

    console.log(message)

    setTimeout(() => {
      this.visible = false;
      this.message = null;
    }, 3000);
  }
}
