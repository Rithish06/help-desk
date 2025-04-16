import { Component, Inject, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductsService } from '../../services/products/products.service';
import { TicketService } from '../../services/ticket/ticket.service';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';

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
    @Inject(PLATFORM_ID) private platformId: Object
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

  getAllProducts(): void {
    this.product.getAllProducts().subscribe((data: any) => {
      this.allProducts = data;
      this.loadProductName();
    });
  }

  loadProductName(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const products = localStorage.getItem('products');
    if (this.allProducts) {
      this.filteredProducts = this.allProducts.filter(
        (entry: any) =>
          products?.includes(entry.productId) && entry.productType === 'website'
      );
      this.formProductName = this.filteredProducts.map((entry: any) => ({
        name: entry.name,
        id: entry._id
      }));
    }
  }

  loadMenuPath(e: any): void {
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
    this.ticketForm.get('menuPath')?.reset();
    this.selectedOptions = []; // Reset selected options
  }

  onChoosingFile(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.ticketForm.patchValue({ attachment: file });
    }
  }

  onSubmit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    this.isSubmitted = true;
    console.log('Form validity:', this.ticketForm.valid);
    if (this.ticketForm.valid) {
      this.isLoading = true
      const formData = new FormData();
      formData.append('clientName', this.clientName || '');
      formData.append('ticketFor', this.ticketFor);
      formData.append('clientId', localStorage.getItem('clientId') || '');
      formData.append('title', this.ticketForm.get('title')?.value || '');
      formData.append('description', this.ticketForm.get('ticketBody')?.value || '');
      formData.append('menuPath', JSON.stringify(this.selectedOptions)); // Send as [{name: "obj 1"}, {name: "obj 2"}]
      formData.append('productName', this.productname || '');
      formData.append('prefix', localStorage.getItem('ticketPrefix') || '');

      const attachment = this.ticketForm.get('attachment')?.value;
      if (attachment) {
        formData.append('file', attachment, attachment.name);
      }

      console.log('Form data:');
      // for (const [key, value] of formData.entries()) {
      //   console.log(`${key}: ${value instanceof File ? value.name : value}`);
      // }

      this.ticket.createTicket(formData).subscribe({
        next: (response) => {
          console.log('Ticket sent successfully:', response);
          this.ticketForm.reset();
          this.isSubmitted = false;
          this.selectedOptions = [];
          this.isLoading = false
        },
        error: (error) => {
          console.error('Error sending ticket:', error);
          this.isLoading = false
        }
      });
      this.isLoading = false
    } else {
      console.log('Form is invalid');
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