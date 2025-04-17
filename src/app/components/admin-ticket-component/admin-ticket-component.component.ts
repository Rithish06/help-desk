import { Component, Inject, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { TicketService } from '../../services/ticket/ticket.service';
import { formatTime,convertUTCtoIST, formatDate } from '../../utils.fun';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-admin-ticket-component',
  templateUrl: './admin-ticket-component.component.html',
  styleUrls: ['./admin-ticket-component.component.css']
})
export class AdminTicketComponentComponent implements OnChanges {
  @Input() ticket: any;
  isInputDisabled: boolean = false;
  isSaveButton: boolean = false;
  newComment: any;
  comments: any = [];

  userType: any;
  userName: any;

  selectedStatus: string = '';
  selectedAdminStatus: string = '';
  selectedPriority: string = '';

  statusDropDown: boolean = false;
  priorClientDropDown: boolean = false;
  priorAdminDropDown: boolean = false;

  originalStatus: any;
  originalAdminStatus: any;
  originalPriority: any;

  isActive: boolean = false;
  selectedFile: File | null = null;
  isDisable: boolean = false;

  statusOptions = [
    { label: 'Raised', color: '#3B8AFF', value: 'raised' },
    { label: 'On-Going', color: '#fbc531', value: 'on-going' },
    { label: 'Resolved', color: '#4cd137', value: 'resolved' }
  ];

  adminStatus = [
    { label: 'In dev', value: 'In dev' },
    { label: 'Dev done', value: 'Dev done' },
    { label: 'In QA', value: 'In QA' },
    { label: 'QA Done', value: 'QA Done' },
    { label: 'Deployed', value: 'Deployed' },
    { label: 'Resolved', value: 'Resolved' },
  ];

  priority = [
    { label: 'Low', value: 'low' },
    { label: 'Midium', value: 'medium' },
    { label: 'High', value: 'high' },
  ];

  constructor(private ticketService: TicketService, @Inject(PLATFORM_ID) private platformId: Object) { }

  ngOnInit() {
    this.userType = localStorage.getItem('role');
    this.userName = localStorage.getItem('name') || 'Unknown User';
    
    // Initialize from database values
    this.originalStatus = this.ticket?.[0]?.status;
    this.originalAdminStatus = this.ticket?.[0]?.adminStatus;
    this.originalPriority = this.ticket?.[0]?.priority;
    
    // Set initial values
    this.selectedStatus = this.originalStatus || 'raised';
    this.selectedAdminStatus = this.originalAdminStatus || 'In dev';
    this.selectedPriority = this.originalPriority || 'low';
    
    // Enable/disable fields based on initial status
    this.updateFieldAccess();

    if (this.ticket) {
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
      this.comments = this.ticket[0].comment.map((entry: any) => ({
        comment: entry.comment,
        commentBy: entry.commentedBy,
        commentAttachment: entry?.commentAttachment,
        commentTime: convertUTCtoIST(entry.commentedAt),
        commentDate: formatDate(entry.commentedAt)
      }));
    } else {
      this.comments = [];
    }
  }

  toggleDropdown(module: string): void {
    if (module === 'status') {
      this.statusDropDown = !this.statusDropDown;
      this.priorClientDropDown = false;
      this.priorAdminDropDown = false;
    } else if (module === 'priorClient') {
      this.priorClientDropDown = !this.priorClientDropDown;
      this.priorAdminDropDown = false;
      this.statusDropDown = false;
    } else if (module === 'priorAdmin') {
      this.priorAdminDropDown = !this.priorAdminDropDown;
      this.statusDropDown = false;
      this.priorClientDropDown = false;
    }
  }

  closeDropdown(module: string): void {
    if (module === 'status') {
      this.statusDropDown = false;
    } else if (module === 'priorClient') {
      this.priorClientDropDown = false;
    } else if (module === 'priorAdmin') {
      this.priorAdminDropDown = false;
    }
  }

  selectStatus(option: any): void {
    this.selectedStatus = option.value;
    this.statusDropDown = false;

    if (this.ticket && this.ticket.length > 0) {
      this.ticket[0].statusColor = this.getStatusColor(this.selectedStatus);
    }
    
    // Auto-update admin status if resolved
    if (this.selectedStatus === 'resolved') {
      this.selectedAdminStatus = 'Resolved';
    }
    
    this.updateFieldAccess();
  }

  getStatusColor(status: string): string {
    const statusOption = this.statusOptions.find(opt => opt.value === status);
    return statusOption ? statusOption.color : '#cccccc'; // default color
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

  onChoosingCommentFile(event: any): void {
    if (this.isActive) {
      this.selectedFile = event.target.files[0] as File;
    }
  }

  updateFieldAccess(): void {
    this.isActive = ['on-going', 'resolved'].includes(this.selectedStatus);
  }

  submitReply(): void {
    this.isDisable = true;
    const ticketId = this.ticket[0].ticketId;
    const updates:any = [];
    const hasComment = this.newComment?.trim();

    // Prepare comment data if exists
    let commentPromise = Promise.resolve(null);
    if (hasComment) {
      const formData = new FormData();
      formData.append('comment', this.newComment.trim());
      formData.append('commentedBy', this.userName);
      
      if (this.selectedFile) {
        formData.append('file', this.selectedFile);
      }

      const newCommentObj = {
      comment: this.newComment.trim(),
      commentBy: this.userName,
      commentAttachment: null, // Temporary null
      commentTime: convertUTCtoIST(new Date().toString()),
      commentDate: formatDate(new Date().toString()),
      isUploading: !!this.selectedFile
    };
    
    // Create new array reference with spread operator
    this.comments = [...this.comments, newCommentObj];

      commentPromise = this.ticketService.addComment(ticketId, formData).toPromise()
        .then(newComment => {
          return newComment;
        });
    }

    // Check for status updates
    if (this.selectedStatus !== this.originalStatus) {
      updates.push(this.ticketService.updateStatus(ticketId, this.selectedStatus));
    }

    // Check for admin status updates
    if (this.selectedAdminStatus !== this.originalAdminStatus) {
      updates.push(this.ticketService.updateAdminStatus(ticketId, this.selectedAdminStatus));
    }

    // Check for priority updates
    if (this.selectedPriority !== this.originalPriority) {
      updates.push(this.ticketService.updateClientPriority(ticketId, this.selectedPriority));
    }

    // Execute all updates
    commentPromise.then(() => {
      if (updates.length > 0) {
        forkJoin(updates).subscribe({
          next: () => this.handleSuccess(),
          error: (err) => this.handleError(err)
        });
      } else {
        this.handleSuccess();
      }
    }).catch(err => this.handleError(err));
  }

  private handleSuccess(): void {
    this.newComment = '';
    this.selectedFile = null;
    this.isDisable = false;
    
    // Update original values to current selections
    this.originalStatus = this.selectedStatus;
    this.originalAdminStatus = this.selectedAdminStatus;
    this.originalPriority = this.selectedPriority;

    this.ticket.sta
  }

  private handleError(err: any): void {
    console.error('Error:', err);
    this.isDisable = false;
    // You might want to show an error message here
  }
}