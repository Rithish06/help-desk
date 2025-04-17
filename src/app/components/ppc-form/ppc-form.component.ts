import { Component, Inject, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductsService } from '../../services/products/products.service';
import { TicketService } from '../../services/ticket/ticket.service';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-ppc-form',
  templateUrl: './ppc-form.component.html',
  styleUrl: './ppc-form.component.css'
})
export class PpcFormComponent {
  ticketForm: FormGroup;
  allProducts: any;
  filteredProducts: any;
  formProductName: any;
  pathName: any;
  isSubmitted = false; // Track form submission

  clientName: any;
  title: any;
  clientId: any;
  disabled: boolean = true;

  // this choosen path
  choosenPath: any;
  productname: any;
  inputDisable: boolean = false;
  ticketFor: any;

  choosenModule: any;
  menupaths: any;

  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private product: ProductsService,
    private ticket: TicketService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private snackBar: MatSnackBar
  ) {
    this.ticketForm = this.fb.group({
      title: ['', Validators.required],
      // websiteName: ['', Validators.required],
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
    this.ticketFor = 'PPC';
    this.getALlProducts();
    this.productname = 'PPC';
  }

  getALlProducts(): void {
    this.product.getAllProducts().subscribe((data: any) => {
      this.allProducts = data;
      this.loadProductName();
    });
  }

  loadProductName(): void {
    const products = localStorage.getItem('products');
    if (this.allProducts) {
      this.filteredProducts = this.allProducts.filter(
        (entry: any) => products?.includes(entry.productId) && entry.productType === 'ppc'
      );
      this.formProductName = this.filteredProducts.map((entry: any) => ({
        name: entry.name,
        id: entry._id
      }));
    }

    this.loadMenuPath(this.formProductName.id);
  }

  loadMenuPath(e: any): void {
    console.log(this.productname, 'productName');

    this.pathName = this.filteredProducts.flatMap((entry: any) => {
      const paths = entry.models?.[0]?.modules?.[0]?.path || [];
      return paths.map((p: any) => ({
        name: p.pathName,
        id: p._id
      }));
    });
    this.ticketForm.get('menuPath')?.setValue('');
  }

  onchoosingMenuPath(event: any): void {
    const selectedId = event.target.value;

    const pathName = this.pathName.filter((entry: any) => entry.id === event.target.value).map((entry: any) => entry.name);
    console.log(pathName);

    this.choosenModule = [{ name: pathName[0] }]; // Set as array of objects with name property
    console.log(this.choosenModule);

    this.menupaths = this.filteredProducts[0]?.models[0]?.modules[0]?.path
      .filter((entry: any) => entry._id === event.target.value)
      .flatMap((entry: any) =>
        entry.section.map((s: any) => ({
          id: s.id,
          sectionName: s.sectionName
        }))
      );
    console.log(this.menupaths, 'menupaths');
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

    if(this.ticketForm.valid){
      console.log("valid")
      this.isLoading = true;
      const formData = new FormData();
    
    formData.append('clientName', this.clientName);
    formData.append('ticketFor', this.ticketFor);
    formData.append('clientId', localStorage.getItem('clientId') || '');
    formData.append('title', this.ticketForm.get('title')?.value);
    formData.append('description', this.ticketForm.get('ticketBody')?.value);
    formData.append('module', this.ticketForm.get('menuPath')?.value);
    formData.append('menuPath', JSON.stringify(this.choosenModule)); // Stringify the array
    formData.append('productName', this.productname);
    formData.append('prefix', localStorage.getItem('ticketPrefix') || '');
    
    if (this.ticketForm.get('attachment')?.value) {
      formData.append('file', this.ticketForm.get('attachment')?.value);
    }

    this.ticket.createTicket(formData).subscribe({
      next: (response) => {
        console.log('Ticket sent successfully:', response);
        this.ticketForm.reset();
        this.isSubmitted = false; // Reset submission state
        this.isLoading = false;
        this.choosenModule = []
        this.showSnackbar('Your ticket for PPC is raised successfully!', 'success');
      },
    
      error: (error) => {
        console.error('Error sending ticket:', error);
        this.isLoading = false;
        this.isSubmitted = false
        this.showSnackbar('Failed to raise ticket. Please try again.', 'error');
      }

    });
  }
  else{
    this.showSnackbar('Please fill all required fields correctly', 'error');
  }
  }

  onClear(): void {
    this.ticketForm.reset();
    this.isSubmitted = false; // Reset submission state
    this.showSnackbar('Form cleared.', 'info');
  }

  private showSnackbar(message: string, type: 'success' | 'error' | 'info' = 'info'): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      verticalPosition: 'top',
      horizontalPosition: 'right',
      panelClass: [`${type}-snackbar`]
    });
  }
}
