import { Component, Inject, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductsService } from '../../services/products/products.service';
import { TicketService } from '../../services/ticket/ticket.service';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar'; // Added import


@Component({
  selector: 'app-seo-form',
  templateUrl: './seo-form.component.html',
  styleUrls: ['./seo-form.component.css']
})
export class SeoFormComponent {
  ticketForm: FormGroup;
  allProducts: any;
  filteredProducts: any;
  formProductName: any;
  pathName: any;
  isSubmitted = false;

  clientName: any;
  productname: any;
  inputDisable: boolean = false;
  ticketFor: any = 'SEO';

  selectedOptions: { name: string }[] = []; // Store selected menu path options as objects
  isOpen: boolean = false; // Control dropdown visibility

  isLoading : boolean = false

  @Input() placeholder: string = 'Select Menu Path';
  @Output() selectionChange = new EventEmitter<{ name: string }[]>();

  constructor(
    private fb: FormBuilder,
    private product: ProductsService,
    private ticket: TicketService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private snackBar: MatSnackBar
  ) {
    this.ticketForm = this.fb.group({
      title: ['', Validators.required],
      websiteName: ['', Validators.required],
      menuPath: ['', Validators.required], // Updated to reflect custom dropdown
      ticketBody: ['', [Validators.required, Validators.minLength(10)]],
      attachment: [null]
    });
  }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.clientName = localStorage.getItem('name') || '';
      this.inputDisable = true;
      this.getAllProducts();
    }
  }

  private showSnackbar(message: string, type: 'success' | 'error' | 'info' = 'info'): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      verticalPosition: 'top',
      horizontalPosition: 'right',
      panelClass: [`${type}-snackbar`]
    });
  }

  getAllProducts(): void {
    this.product.getAllProducts().subscribe({
      next: (data: any) => {
        this.allProducts = data;
        this.loadProductName();
      },
      error: (error) => {
        console.error('Error loading websites:', error);
        this.showSnackbar('Failed to load websites. Please try again.', 'error');
      }
    });
  }

  loadProductName(): void {
    try {
      const products = localStorage.getItem('products');
      if (this.allProducts) {
        this.filteredProducts = this.allProducts.filter(
          (entry: any) => products?.includes(entry.productId) && entry.productType === 'website'
        );
        this.formProductName = this.filteredProducts.map((entry: any) => ({
          name: entry.name,
          id: entry._id
        }));
      }
    } catch (error) {
      console.error('Error loading website names:', error);
      this.showSnackbar('Error loading website information', 'error');
    }
  }


  loadMenuPath(e: any): void {
    try{
      this.productname = this.formProductName
      .filter((entry: any) => entry.id === e.target.value)
      .map((entry: any) => entry.name)[0];

    this.pathName = this.filteredProducts.flatMap((entry: any) => {
      const paths = entry.models?.[0]?.modules?.[0]?.path || [];
      return paths.map((p: any) => ({
        name: p.pathName,
        id: p._id
      }));
    });
    this.ticketForm.get('menuPath')?.setValue('');
    this.selectedOptions = []; // Reset selected options
    }
    catch(error){
      this.showSnackbar('Error loading website pages', 'error');
    }
  }

  onChoosingFile(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.ticketForm.patchValue({ attachment: file });
    }
  }

  onSubmit(): void {
    // Condition 1: Check if platform is browser
    if (!isPlatformBrowser(this.platformId)) return;

    this.isSubmitted = true;
    console.log('Form validity:', this.ticketForm.valid);
    
    // Condition 2: Check if form is valid
    if (!this.ticketForm.valid) {
        this.isLoading = true;
        const formData = new FormData();
        
        // Append data with fallback empty strings
        formData.append('clientName', this.clientName || '');
        formData.append('ticketFor', this.ticketFor);
        formData.append('clientId', localStorage.getItem('clientId') || '');
        formData.append('title', this.ticketForm.get('title')?.value || '');
        formData.append('description', this.ticketForm.get('ticketBody')?.value || '');
        formData.append('menuPath', JSON.stringify(this.selectedOptions));
        formData.append('productName', this.productname || '');
        formData.append('prefix', localStorage.getItem('ticketPrefix') || '');

        // Condition 3: Check if attachment exists
        const attachment = this.ticketForm.get('attachment')?.value;
        if (attachment) {
            formData.append('file', attachment, attachment.name);
        }

        console.log('Form data:');
        
        this.ticket.createTicket(formData).subscribe({
            next: (response) => {
                console.log('Ticket sent successfully:', response);
                this.ticketForm.reset();
                this.isSubmitted = false;
                this.selectedOptions = [];
                this.isLoading = false;
                this.showSnackbar('SEO ticket created successfully!', 'success');
            },
            error: (error) => {
                console.error('Error sending ticket:', error);
                this.isLoading = false;
                this.showSnackbar('Failed to create SEO ticket. Please try again.', 'error');
            }
        });
        this.isLoading = false;
    } 
    // Condition 4: Form is invalid case
    else {
        console.log('Form is invalid');
        this.showSnackbar('Please fill all required fields correctly', 'error');
    }
}
  onClear(): void {
    this.ticketForm.reset();
    this.selectedOptions = [];
    this.isSubmitted = false;
  }

  // Dropdown methods
  toggleDropdown(): void {
    this.isOpen = !this.isOpen;
  }

  isSelected(value: string): boolean {
    return this.selectedOptions.some(option => option.name === value);
  }

  selectOption(value: string): void {
    const index = this.selectedOptions.findIndex(option => option.name === value);
    if (index > -1) {
      this.selectedOptions.splice(index, 1);
    } else {
      this.selectedOptions.push({ name: value });
    }
    this.ticketForm.get('menuPath')?.setValue(this.selectedOptions); // Sync with form control
    this.selectionChange.emit(this.selectedOptions); // Emit updated selection
    console.log('Selected options:', this.selectedOptions);
  }

  getSelectedLabels(): string {
    if (!this.pathName || !this.selectedOptions.length) return '';
    return this.selectedOptions.map(option => option.name).join(', ');
  }

  onCheckboxClick(event: Event, value: string): void {
    event.stopPropagation();
    this.selectOption(value);
  }
}