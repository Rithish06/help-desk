import { Component, Output, EventEmitter, HostListener, ElementRef, ViewChild } from '@angular/core';
import { LocalstorageService } from '../../services/localstorage/localstorage.service';
@Component({
  selector: 'app-header-section',
  templateUrl: './header-section.component.html',
  styleUrls: ['./header-section.component.css']
})
export class HeaderSectionComponent {
  profilePic: any;
  userName: any;
  notificationBarController: boolean = false;

  @ViewChild('notificationBar') notificationBar!: ElementRef;
  @ViewChild('notificationIcon') notificationIcon!: ElementRef;

  @Output() sendTicketData = new EventEmitter<any>();

  ngOnInit() {
    this.profilePic = this.storage.getItem("profilePic");
    this.userName = this.storage.getItem("name");
  }

  constructor( private storage : LocalstorageService ){}

  notificationBarToggle(): void {
    this.notificationBarController = !this.notificationBarController;
  }

  openTicket(e: any): void {
    this.sendTicketData.emit(e);
  }

  closeNotification(e: any): void {
    this.notificationBarController = e;
  }

  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent): void {
    if (this.notificationBarController && 
        !this.notificationBar?.nativeElement?.contains(event.target) && 
        !this.notificationIcon?.nativeElement?.contains(event.target)) {
      this.notificationBarController = false;
    }
  }
}