import { Component, Inject, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { TicketService } from '../../services/ticket/ticket.service';
import { formatTime, formatDate } from '../../utils.fun';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { forkJoin } from 'rxjs';


@Component({
  selector: 'app-admin-ticket-component',
  templateUrl: './admin-ticket-component.component.html',
  styleUrl: './admin-ticket-component.component.css'
})
export class AdminTicketComponentComponent implements OnChanges {
  @Input() ticket: any;
  isInputDisabled: boolean = false;
  isSaveButton: boolean = false;
  newComment: any;
  comments: any;

  userType: any;
  userName: any;

  selectedStatus: string = 'Select Status';
  selectedAdminStatus: string = 'Select Status(admin)';
  selectedPriority: string = 'Select Priority';

  statusDropDown: boolean = false;
  priorClientDropDown: boolean = false;
  priorAdminDropDown: boolean = false;

  originalStatus: any;
  originalAdminStatus: any;
  originalPriority: any;

  hideComments: boolean = false;

  isActive: boolean = false;
  selectedFile: File | null = null;

  constructor(private ticketService: TicketService, @Inject(PLATFORM_ID) private platformId: Object) { }

  ngOnInit() {
    this.userType = localStorage.getItem('role');
    this.userName = localStorage.getItem('name') || 'Unknown User';
    console.log(this.ticket, 'from single');

    this.originalStatus = this.ticket?.[0]?.status;
    this.originalAdminStatus = this.ticket?.[0]?.adminStatus;
    this.originalPriority = this.ticket?.[0]?.priority;
    console.log(this.originalStatus, this.originalAdminStatus);

    if (this.ticket) {
      if (this.ticket[0].status === 'on-going') {
        this.isActive = true;
      }

      if (this.ticket?.menupath?.length > 0 && typeof this.ticket.menupath[0] === 'string') {
        try {
          this.ticket.module = JSON.parse(this.ticket.menupath[0]);
        } catch (error) {
          console.error('Failed to parse menupath:', error);
          this.ticket.module = [];
        }
      } else if (this.ticket?.menupath?.length > 0) {
        this.ticket.module = this.ticket.menupath[0];
      }
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['ticket']) {
      this.loadComments();
    }
  }

  loadComments(): void {
    if (this.ticket && this.ticket[0]?.comment) {
      const comment = this.ticket[0].comment;
      this.comments = comment.map((entry: any) => ({
        comment: entry.comment,
        commentBy: entry.commentedBy,
        commentAttachment : entry?.commentAttachment,
        commentTime: formatTime(entry.commentedAt),
        commentDate: formatDate(entry.commentedAt)
      }));

      this.hideComments = this.comments.length === 0;
    } else {
      this.comments = [];
      this.hideComments = true;
    }

    console.log(this.comments, 'comments');
  }

  onclickEditComment(): void {
    this.isInputDisabled = true;
    this.isSaveButton = false;
  }

  commentTextOnchange(e: any): void {
    if (e !== '') {
      this.isSaveButton = true;
    } else {
      this.isSaveButton = false;
    }
  }

  onClickEdit(): void {
    this.isInputDisabled = true;
  }

  addComment() {
    if (!isPlatformBrowser(this.platformId)) return;

    const formData = new FormData();
    formData.append('comment', this.newComment || '');
    formData.append('commentedBy', this.userName);
    if (this.selectedFile) {
      formData.append('file', this.selectedFile);
    }

    this.ticketService.updateComment(this.ticket[0].ticketId, formData).subscribe({
      next: (response: any) => {
        console.log('Comment added:', response);
        this.newComment = '';
        this.selectedFile = null;
      },
      error: (err: any) => {
        console.error('Error:', err);
      },
    });
  }

  statusOptions = [
    { label: 'None', color: '#fff', value: '' },
    { label: 'Raised', color: '#ff6b6b', value: 'raised' },
    { label: 'On-Going', color: '#fbc531', value: 'on-going' },
    { label: 'Resolved', color: '#4cd137', value: 'resolved' }
  ];

  adminStatus = [
    { label: 'None', value: '' },
    { label: 'In dev', value: 'In dev' },
    { label: 'Dev done', value: 'Dev done' },
    { label: 'In QA', value: 'In QA' },
    { label: 'QA Done', value: 'QA Done' },
    { label: 'Deployed', value: 'Deployed' },
    { label: 'Resolved', value: 'Resolved' },
  ];

  priority = [
    { label: 'None', value: '' },
    { label: 'Low Priority', value: 'low' },
    { label: 'Mid Priority', value: 'medium' },
    { label: 'High Priority', value: 'high' },
  ];

  toggleDropdown(module: any) {
    if (module === 'status') {
      this.statusDropDown = !this.statusDropDown;
      this.priorClientDropDown = false;
      this.priorAdminDropDown = false;
    } else if (module === 'priorClient') {
      this.priorClientDropDown = !this.priorClientDropDown;
      this.priorAdminDropDown = false;
      this.statusDropDown = false;
    } else {
      this.priorAdminDropDown = !this.priorAdminDropDown;
      this.statusDropDown = false;
      this.priorClientDropDown = false;
    }
  }

  closeDropdown(module: string) {
    if (module === 'status') {
      this.statusDropDown = false;
    } else if (module === 'priorClient') {
      this.priorClientDropDown = false;
    } else if (module === 'priorAdmin') {
      this.priorAdminDropDown = false;
    }
  }

  selectStatus(option: any) {
    this.selectedStatus = option.value;
    this.statusDropDown = false;
  }

  getAdminStatus(label: string): void {
    this.selectedAdminStatus = label;
    this.priorAdminDropDown = false;
  }

  getPriority(label: string): void {
    this.selectedPriority = label;
    this.priorClientDropDown = false;
  }

  getColor(label: string): string {
    return this.statusOptions.find(opt => opt.value === label)?.color || '#ccc';
  }

  isDisable : boolean = false

  // submitReply(): void {

  //   this.isDisable = true

  //   const ticketId = this.ticket[0].ticketId;
  //   let hasUpdates = false;
  
  //   console.log('Ticket ID:', ticketId); // Debug the ticketId
  
  //   // Check for updates to the ticket status, admin status, or priority
  //   if (
  //     this.selectedStatus &&
  //     this.selectedStatus !== this.originalStatus &&
  //     this.selectedStatus !== 'Select Status' &&
  //     this.selectedStatus !== 'None' &&
  //     this.selectedStatus.trim() !== ''
  //   ) {
  //     hasUpdates = true;
  //     this.ticketService.updateStatus(ticketId, this.selectedStatus).subscribe({
  //       next: (res) => console.log('Status updated:', res),
  //       error: (err) => console.error('Status update error:', err)
  //     });
  //   }
  
  //   if (
  //     this.selectedAdminStatus &&
  //     this.selectedAdminStatus !== this.originalAdminStatus &&
  //     this.selectedAdminStatus !== 'Select Status(admin)' &&
  //     this.selectedAdminStatus !== 'None' &&
  //     this.selectedAdminStatus.trim() !== ''
  //   ) {
  //     hasUpdates = true;
  //     this.ticketService.updateAdminStatus(ticketId, this.selectedAdminStatus).subscribe({
  //       next: (res) => console.log('Admin status updated:', res),
  //       error: (err) => console.error('Admin status update error:', err)
  //     });
  //   }
  
  //   if (
  //     this.selectedPriority &&
  //     this.selectedPriority !== this.originalPriority &&
  //     this.selectedPriority !== 'Select Priority' &&
  //     this.selectedPriority !== 'None' &&
  //     this.selectedPriority.trim() !== ''
  //   ) {
  //     hasUpdates = true;
  //     this.ticketService.updateClientPriority(ticketId, this.selectedPriority).subscribe({
  //       next: (res) => console.log('Client priority updated:', res),
  //       error: (err) => console.error('Client priority update error:', err)
  //     });
  //   }
  
  //   const trimmedComment = this.newComment?.trim();
  //   if (trimmedComment && trimmedComment !== '') {
  //     hasUpdates = true;
  
  //     // Create FormData for the comment and file (if provided)
  //     const formData = new FormData();
  //     formData.append('comment', trimmedComment);
  //     formData.append('commentedBy', this.userName);
      
  //     if (this.selectedFile) {
  //       formData.append('file', this.selectedFile);
  //     }
  
  //     // Pass the FormData to the backend
  //     this.ticketService.addComment(ticketId, formData).subscribe({
  //       next: (res) => {
  //         console.log('Comment added:', res);
  //         this.newComment = '';
  //         this.selectedFile = null;
  //       },
  //       error: (err) => console.error('Add comment error:', err)
  //     });
  //   }
  
  //   if (!hasUpdates) {
  //     console.log('No changes made');
  //   }

  //   this.isDisable = false
  // }

  
  submitReply(): void {
    this.isDisable = true;
  
    const ticketId = this.ticket[0].ticketId;
    let hasUpdates = false;
    const apiCalls = [];
  
    console.log('Ticket ID:', ticketId); // Debug the ticketId
  
    // Check for updates to the ticket status
    if (
      this.selectedStatus &&
      this.selectedStatus !== this.originalStatus &&
      this.selectedStatus !== 'Select Status' &&
      this.selectedStatus !== 'None' &&
      this.selectedStatus.trim() !== ''
    ) {
      hasUpdates = true;
      apiCalls.push(
        this.ticketService.updateStatus(ticketId, this.selectedStatus)
      );
    }
  
    // Check for updates to the admin status
    if (
      this.selectedAdminStatus &&
      this.selectedAdminStatus !== this.originalAdminStatus &&
      this.selectedAdminStatus !== 'Select Status(admin)' &&
      this.selectedAdminStatus !== 'None' &&
      this.selectedAdminStatus.trim() !== ''
    ) {
      hasUpdates = true;
      apiCalls.push(
        this.ticketService.updateAdminStatus(ticketId, this.selectedAdminStatus)
      );
    }
  
    // Check for updates to the priority
    if (
      this.selectedPriority &&
      this.selectedPriority !== this.originalPriority &&
      this.selectedPriority !== 'Select Priority' &&
      this.selectedPriority !== 'None' &&
      this.selectedPriority.trim() !== ''
    ) {
      hasUpdates = true;
      apiCalls.push(
        this.ticketService.updateClientPriority(ticketId, this.selectedPriority)
      );
    }
  
    // Check for new comment
    const trimmedComment = this.newComment?.trim();
    if (trimmedComment && trimmedComment !== '') {
      hasUpdates = true;
  
      // Create FormData for the comment and file (if provided)
      const formData = new FormData();
      formData.append('comment', trimmedComment);
      formData.append('commentedBy', this.userName);
  
      if (this.selectedFile) {
        formData.append('file', this.selectedFile);
      }
  
      apiCalls.push(this.ticketService.addComment(ticketId, formData));
    }
  
    if (!hasUpdates) {
      console.log('No changes made');
      this.isDisable = false;
      return;
    }
  
    // Execute all API calls and wait for completion
    
    forkJoin(apiCalls).subscribe({
      next: (responses) => {
        console.log('All API calls completed:', responses);
        if (trimmedComment && trimmedComment !== '') {
          this.newComment = '';
          this.selectedFile = null;
        }
        this.isDisable = false;
      },
      error: (err) => {
        console.error('Error in API calls:', err);
        this.isDisable = false;
      }
    });
  }

  onChoosingCommentFile(event: any): void {
    this.selectedFile = event.target.files[0] as File;
  }
}