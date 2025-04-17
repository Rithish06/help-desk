import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar'; // Added import
import { ProductsService } from '../../services/products/products.service';
import { TicketService } from '../../services/ticket/ticket.service';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent {
  ticketForm: FormGroup;
  allProducts: any;
  filteredProducts: any;
  formProductName: any;
  pathName: any;
  isSubmitted = false;

  clientName: any;
  title: any;
  clientId: any;
  disabled: boolean = true;
  choosenPath: any;
  productname: any;
  inputDisable: boolean = false;
  ticketFor: any;
  choosenModule: any;
  menupaths: any;
  selectedMenupath: any;
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private product: ProductsService,
    private ticket: TicketService,
    private snackBar: MatSnackBar // Injected snackbar
  ) {
    this.ticketForm = this.fb.group({
      title: ['', Validators.required],
      websiteName: ['', Validators.required],
      menuPath: ['', Validators.required],
      module: ['', Validators.required],
      ticketBody: ['', [Validators.required, Validators.minLength(10)]],
      attachment: [null]
    });
  }

  ngOnInit() {
    this.clientId = localStorage.getItem('clientId');
    this.clientName = localStorage.getItem('name');
    this.inputDisable = true;
    this.ticketFor = 'product';
    this.getALlProducts();
  }

  private showSnackbar(message: string, type: 'success' | 'error' | 'info' = 'info'): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      verticalPosition: 'top',
      horizontalPosition: 'right',
      panelClass: [`${type}-snackbar`]
    });
  }

  getALlProducts(): void {
    this.product.getAllProducts().subscribe({
      next: (data: any) => {
        this.allProducts = data;
        this.loadProductName();
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.showSnackbar('Failed to load products. Please try again.', 'error');
      }
    });
  }

  loadProductName(): void {
    const products = localStorage.getItem('products');
    if (this.allProducts) {
      this.filteredProducts = this.allProducts.filter(
        (entry: any) => products?.includes(entry.productId) && entry.productType === 'product'
      );
      this.formProductName = this.filteredProducts.map((entry: any) => ({
        name: entry.name,
        id: entry._id
      }));
    }
  }

  loadMenuPath(e: any): void {
    try {
      this.productname = this.formProductName.filter((entry: any) => entry.id === e.target.value).map((entry: any) => entry.name)[0];
      this.pathName = this.filteredProducts.flatMap((entry: any) => {
        const paths = entry.models?.[0]?.modules?.[0]?.path || [];
        return paths.map((p: any) => ({
          name: p.pathName,
          id: p._id
        }));
      });
      this.ticketForm.get('menuPath')?.setValue('');
    } catch (error) {
      console.error('Error loading menu paths:', error);
      this.showSnackbar('Error loading product details', 'error');
    }
  }

  onchoosingMenuPath(event: any): void {
    try {
      const selectedId = event.target.value;
      const pathName = this.pathName.filter((entry: any) => entry.id === event.target.value).map((entry: any) => entry.name);
      this.choosenModule = pathName[0];

      this.menupaths = this.filteredProducts[0]?.models[0]?.modules[0]?.path
        .filter((entry: any) => entry._id === event.target.value)
        .flatMap((entry: any) =>
          entry.section.map((s: any) => ({
            id: s.id,
            sectionName: s.sectionName
          }))
        );
    } catch (error) {
      console.error('Error selecting menu path:', error);
      this.showSnackbar('Error selecting menu path', 'error');
    }
  }

  onChoosingFile(event: any): void {
    try {
      const file = event.target.files[0];
      if (file) {
        if (file.size > 5 * 1024 * 1024) { // 5MB limit
          this.showSnackbar('File size should be less than 5MB', 'error');
          return;
        }
        this.ticketForm.patchValue({ attachment: file });
        this.showSnackbar('File selected successfully', 'success');
      }
    } catch (error) {
      console.error('Error selecting file:', error);
      this.showSnackbar('Error selecting file', 'error');
    }
  }

  onSelectingMenupath(e: any): void {
    this.selectedMenupath = [{ name: e.target.value }];
  }

  onSubmit(): void {
    this.isSubmitted = true;
    if (this.ticketForm.valid) {
      this.isLoading = true;
      const formData = new FormData();
      formData.append('clientName', this.clientName);
      formData.append('ticketFor', this.ticketFor);
      formData.append('clientId', localStorage.getItem('clientId') || '');
      formData.append('title', this.ticketForm.get('title')?.value);
      formData.append('description', this.ticketForm.get('ticketBody')?.value);
      formData.append('module', this.choosenModule);
      formData.append('menuPath', JSON.stringify(this.selectedMenupath));
      formData.append('productName', this.productname);
      formData.append('prefix', localStorage.getItem('ticketPrefix') || '');

      if (this.ticketForm.get('attachment')?.value) {
        formData.append('file', this.ticketForm.get('attachment')?.value);
      }

      this.ticket.createTicket(formData).subscribe({
        next: (response) => {
          console.log('Ticket sent successfully:', response);
          this.ticketForm.reset();
          this.isSubmitted = false;
          this.isLoading = false;
          this.showSnackbar('Ticket created successfully!', 'success');
        },
        error: (error) => {
          console.error('Error sending ticket:', error);
          this.isLoading = false;
          this.showSnackbar('Failed to create ticket. Please try again.', 'error');
        }
      });
    } else {
      this.showSnackbar('Please fill all required fields correctly', 'error');
    }
  }

  onClear(): void {
    this.ticketForm.reset();
    this.isSubmitted = false;
    this.showSnackbar('Form cleared', 'info');
  }
}