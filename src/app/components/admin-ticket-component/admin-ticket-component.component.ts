import { Component, Inject, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { TicketService } from '../../services/ticket/ticket.service';
import { formatTime, convertUTCtoIST, formatDate } from '../../utils.fun';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { forkJoin } from 'rxjs';
import { LocalstorageService } from '../../services/localstorage/localstorage.service';

@Component({
  selector: 'app-admin-ticket-component',
  templateUrl: './admin-ticket-component.component.html',
  styleUrls: ['./admin-ticket-component.component.css']
})
export class AdminTicketComponentComponent implements OnChanges {
  @Input() ticket: any;
  isInputDisabled = false;
  isSaveButton = false;
  newComment: any;
  comments: any = [];

  userType: any;
  userName: any;

  selectedStatus = '';
  selectedAdminStatus = '';
  selectedPriority = '';
  selectedTicketType: any = null;
  selectedSubTicketType: any = null;

  statusDropDown = false;
  priorClientDropDown = false;
  priorAdminDropDown = false;
  ticketTypeDropdown = false;
  subTypeDropdown = false;


  originalStatus: any;
  originalAdminStatus: any;
  originalPriority: any;
  originalTicketType: any;
  originalSubTicketType: any;

  isActive = false;
  selectedFile: File | null = null;
  isDisable = false;

  activeSubMenu: string | null = null;
  selectedMainTicketType: any = null;

  isTicketTypeLocked: boolean = false;

  @Input() assignedTo : any 

  statusOptions = [
    { label: 'Open', color: '#3B8AFF', value: 'Open' },
    { label: 'Hold', color: '#fbc531', value: 'Hold' },
    { label: 'In Process', color: '#fbc531', value: 'In Process' },
    { label: 'Requirement Not Finalized', color: '#fbc531', value: 'Requirement Not Finalized' },
    { label: 'Specification Approved', color: '#fbc531', value: 'Specification Approved' },
    { label: 'Commercial Approved', color: '#fbc531', value: 'Commercial Approved' },
    { label: 'Ready', color: '#fbc531', value: 'Ready' },
    { label: 'Deployed', color: '#fbc531', value: 'Deployed' },
    { label: 'Specification Sent', color: '#fbc531', value: 'Specification Sent' },
    { label: 'Commercial Sent', color: '#4cd137', value: 'Commercial Sent' }
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
    { label: 'Level 1', value: 'Level 1' },
    { label: 'Level 2', value: 'Level 2' },
    { label: 'Level 3', value: 'Level 3' },
  ];

  ticketTypes = [
    {
      label: 'Incident',
      subtypes: [
        { label: 'Limited Impact' },
        { label: 'Business Critical' },
        { label: 'Function Critical' },
        { label: 'Cosmetic Impact' }
      ]
    },
    {
      label: 'Change Request',
      subtypes: [
        { label: 'Chargeable' },
        { label: 'Non-Chargeable' }
      ]
    },
    { label: 'Understanding the Issue' },
    { label: 'Training / Guidance' }
  ];

  statusMap: { [key: string]: any[] } = {
    'Incident': [
      { label: 'New', color: '#3498db', value: 'New' },
      { label: 'Open', color: '#3B8AFF', value: 'Open' },
      { label: 'In Progress', color: '#fbc531', value: 'In Progress' },
      { label: 'Ready', color: '#2ecc71', value: 'Ready' },
      { label: 'Hold', color: '#2ecc71', value: 'Hold' },
      { label: 'Deployed', color: '#1abc9c', value: 'Deployed' },
      { label: 'Closed', color: '#e74c3c', value: 'Closed' }
    ],
    'Change Request': [
      { label: 'New', color: '#3498db', value: 'New' },
      { label: 'Open', color: '#3B8AFF', value: 'Open' },
      { label: 'Requirement Not Finalized', color: '#3B8AFF', value: 'Requirement Not Finalized' },
      { label: 'Specification Sent', color: '#3B8AFF', value: 'Specification Sent' },
      { label: 'Specification Approved', color: '#3B8AFF', value: 'Specification Approved' },
      { label: 'Commercial Sent', color: '#3B8AFF', value: 'Commercial Sent' },
      { label: 'Commercial Approved', color: '#3B8AFF', value: 'Commercial Approved' },
      { label: 'In Process', color: '#3B8AFF', value: 'In Process' },
      { label: 'Ready', color: '#3B8AFF', value: 'Ready' },
      { label: 'Deployed', color: '#2ecc71', value: 'Deployed' },
      { label: 'Hold', color: '#2ecc71', value: 'Hold' },
      { label: 'Closed', color: '#e74c3c', value: 'Closed' }
    ],
    'Understanding the Issue': [
      { label: 'New', color: '#3498db', value: 'New' },
      { label: 'Open', color: '#3B8AFF', value: 'Open' },
      { label: 'Hold', color: '#2ecc71', value: 'Hold' },
      { label: 'Complete', color: '#2ecc71', value: 'Complete' },
      { label: 'Closed', color: '#e74c3c', value: 'Closed' }
    ],
    'Training / Guidance': [
      { label: 'New', color: '#3498db', value: 'New' },
      { label: 'Open', color: '#3B8AFF', value: 'Open' },
      { label: 'Hold', color: '#2ecc71', value: 'Hold' },
      { label: 'Complete', color: '#2ecc71', value: 'Complete' },
      { label: 'Closed', color: '#e74c3c', value: 'Closed' }
    ]
  };

  updateStatusOptions(ticketTypeLabel: string): void {
    if (!ticketTypeLabel) {
      this.statusOptions = [];
      return;
    }

    const originalStatus = this.originalStatus?.toLowerCase();

    if (originalStatus === 'closed') {
      this.statusOptions = [{ label: 'Reopen', color: '#27ae60', value: 'Reopen' }];
    } else {
      this.statusOptions = this.statusMap[ticketTypeLabel] || [];
    }
  }

  constructor(private ticketService: TicketService, @Inject(PLATFORM_ID) private platformId: Object, private storage: LocalstorageService) { }

  ngOnInit() {
    this.userType = this.storage.getItem('role');
    this.userName = this.storage.getItem('name') || 'Unknown User';

    this.originalStatus = this.ticket?.[0]?.status;
    this.originalAdminStatus = this.ticket?.[0]?.adminStatus;
    this.originalPriority = this.ticket?.[0]?.priorText;
    this.originalTicketType = this.ticket?.[0]?.ticketType;
    this.originalSubTicketType = this.ticket?.[0]?.ticketSubType;

    this.selectedStatus = this.originalStatus || 'Select Status';
    this.selectedAdminStatus = this.originalAdminStatus || 'In dev';
    this.selectedPriority = this.originalPriority || 'Select Priority';
    this.selectedTicketType = this.originalTicketType
    this.selectedSubTicketType = this.originalSubTicketType

    console.log(this.originalPriority, "priority")

    this.updateFieldAccess();

    this.selectedTicketType = this.ticketTypes.find(type => type.label === this.originalTicketType) || null;
    if (this.selectedTicketType?.subtypes?.length > 0) {
      this.selectedSubTicketType = this.selectedTicketType.subtypes.find(
        (sub: any) => sub.label === this.originalSubTicketType
      ) || null;
    }

    if (this.originalTicketType && this.originalSubTicketType) {
      this.isTicketTypeLocked = true;
    }

    if (this.ticket?.menupath?.length > 0) {
      try {
        this.ticket.module = typeof this.ticket.menupath[0] === 'string'
          ? JSON.parse(this.ticket.menupath[0])
          : this.ticket.menupath[0];
      } catch (error) {
        console.error('Failed to parse menupath:', error);
        this.ticket.module = [];
      }
    }

    this.updateStatusOptions(this.originalTicketType);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['ticket']) {
      this.loadComments();
    }
  }

  loadComments(): void {
    this.comments = this.ticket?.[0]?.comment?.map((entry: any) => ({
      comment: entry.comment,
      commentBy: entry.commentedBy,
      commentAttachment: entry?.commentAttachment,
      commentTime: convertUTCtoIST(entry.commentedAt),
      commentDate: formatDate(entry.commentedAt)
    })) || [];
  }

  updateFieldAccess(): void {
    this.isActive = !(this.selectedStatus === 'New' || this.selectedStatus === 'raised');
  }

  onChoosingCommentFile(event: any): void {
    if (this.isActive) {
      this.selectedFile = event.target.files[0] as File;

      // Image preview
      if (this.selectedFile && this.selectedFile.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = () => {
          this.imagePreview = reader.result;
        };
        reader.readAsDataURL(this.selectedFile);
      } else {
        this.imagePreview = null;
      }
    }
  }

  submitReply(): void {
    this.isDisable = true;
    const ticketId = this.ticket[0].ticketId;
    const updates: any[] = [];
    const hasComment = this.newComment?.trim();

    let commentPromise = Promise.resolve(null);

    if (hasComment) {
      const formData = new FormData();
      formData.append('comment', this.newComment.trim());
      formData.append('commentedBy', this.userName);
      formData.append('lastlyRepliedBy', this.userName)

      if (this.selectedFile) {
        formData.append('file', this.selectedFile);
      }

      const previewUrl = this.selectedFile ? URL.createObjectURL(this.selectedFile) : null;

      const newCommentObj = {
        comment: this.newComment.trim(),
        commentBy: this.userName,
        commentAttachment: this.imagePreview,
        commentPreview: previewUrl,
        commentTime: convertUTCtoIST(new Date().toString()),
        commentDate: formatDate(new Date().toString()),
        isUploading: !!this.selectedFile
      };

      this.comments = [...this.comments, newCommentObj];

      this.isTicketTypeLocked = true
      this.isTicketTypeLocked = true

      commentPromise = this.ticketService.addComment(ticketId, formData).toPromise();
    }

    if (this.selectedStatus !== this.originalStatus) {
      updates.push(this.ticketService.updateStatus(ticketId, this.selectedStatus));
    }

    if (this.selectedAdminStatus !== this.originalAdminStatus) {
      updates.push(this.ticketService.updateAdminStatus(ticketId, this.selectedAdminStatus));
    }

    if (this.selectedPriority !== this.originalPriority) {
      updates.push(this.ticketService.updateClientPriority(ticketId, this.selectedPriority));
    }

    // ✅ Properly update ticket type and sub-type if not locked
    if (!this.isTicketTypeLocked &&
      (this.selectedTicketType?.label !== this.originalTicketType ||
        this.selectedSubTicketType?.label !== this.originalSubTicketType)) {

      const ticketType = this.selectedTicketType?.label || '';
      const ticketSubType = this.selectedSubTicketType?.label || '';

      updates.push(this.ticketService.updateTicketType(ticketId, { ticketType, ticketSubType }));
    }

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
    this.originalStatus = this.selectedStatus;
    this.originalAdminStatus = this.selectedAdminStatus;
    this.originalPriority = this.selectedPriority;
  }


  imagePreview: string | ArrayBuffer | null = null;

  private handleError(err: any): void {
    console.error('Error:', err);
    this.isDisable = false;
  }

  toggleDropdown(module: string): void {
    this.statusDropDown = module === 'status' ? !this.statusDropDown : false;
    this.priorClientDropDown = module === 'priorClient' ? !this.priorClientDropDown : false;
    this.priorAdminDropDown = module === 'priorAdmin' ? !this.priorAdminDropDown : false;
    this.ticketTypeDropdown = module === 'ticketType' ? !this.ticketTypeDropdown : false;
    this.subTypeDropdown = module === 'subTicketType' ? !this.subTypeDropdown : false; // ✅ Add this
    this.activeSubMenu = null;
  }

  closeDropdown(module: string): void {
    if (module === 'status') this.statusDropDown = false;
    if (module === 'priorClient') this.priorClientDropDown = false;
    if (module === 'priorAdmin') this.priorAdminDropDown = false;
    if (module === 'ticketType') {
      this.ticketTypeDropdown = false;
      this.activeSubMenu = null;
    }
  }

  selectStatus(option: any): void {
    this.selectedStatus = option.value;
    this.statusDropDown = false;
    const selectedOption = this.statusOptions.find(opt => opt.value === this.selectedStatus);
    if (this.ticket?.length > 0 && selectedOption) {
      this.ticket[0].statusColor = selectedOption.color;
    }
    if (this.selectedStatus.toLowerCase() === 'resolved') {
      this.selectedAdminStatus = 'Resolved';
    }
    this.updateFieldAccess();
  }

  getStatusColor(status: string): string {
    return this.statusOptions.find(opt => opt.value === status)?.color || '#cccccc';
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

  showSubMenu(type: any) {
    if (type.subtypes) {
      this.activeSubMenu = type.label;
    }
  }

  hideSubMenu() {
    this.activeSubMenu = null;
  }
  selectTicketType(type: any) {
    this.selectedTicketType = type;
    this.selectedSubTicketType = null;  // Reset sub ticket type on main change
    this.ticketTypeDropdown = false;

    this.updateStatusOptions(type.label);
  }

  selectSubTicketType(sub: any) {
    this.selectedSubTicketType = sub;
    this.subTypeDropdown = false;

    this.updateStatusOptions(this.selectedTicketType?.label);
  }


  hasSubtypes(type: any): boolean {
    return Array.isArray(type.subtypes) && type.subtypes.length > 0;
  }
}