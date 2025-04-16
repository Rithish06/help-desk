import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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

  selectedMenupath: any; // Keep as any for compatibility, will be adjusted

  isLoading : boolean = false

  constructor(
    private fb: FormBuilder,
    private product: ProductsService,
    private ticket: TicketService
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
        (entry: any) => products?.includes(entry.productId) && entry.productType === 'product'
      );
      this.formProductName = this.filteredProducts.map((entry: any) => ({
        name: entry.name,
        id: entry._id
      }));
    }
  }

  loadMenuPath(e: any): void {
    this.productname = this.formProductName.filter((entry: any) => entry.id === e.target.value).map((entry: any) => entry.name)[0];
    console.log(this.productname, 'productName');

    this.pathName = this.filteredProducts.flatMap((entry: any) => {
      const paths = entry.models?.[0]?.modules?.[0]?.path || [];
      return paths.map((p: any) => ({
        name: p.pathName,
        id: p._id
      }));
    });
    this.ticketForm.get('menuPath')?.reset();
  }

  onchoosingMenuPath(event: any): void {
    const selectedId = event.target.value;

    const pathName = this.pathName.filter((entry: any) => entry.id === event.target.value).map((entry: any) => entry.name);
    console.log(pathName);

    this.choosenModule = pathName[0];
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

  onSelectingMenupath(e: any): void {
    this.selectedMenupath = [{ name: e.target.value }]; // Change to array of objects
  }

  onSubmit(): void {
    this.isSubmitted = true; // Mark form as submitted
    if (this.ticketForm.valid) {
      this.isLoading = true
      const formData = new FormData();
      formData.append('clientName', this.clientName);
      formData.append('ticketFor', this.ticketFor);
      formData.append('clientId', localStorage.getItem('clientId') || '');
      formData.append('title', this.ticketForm.get('title')?.value);
      formData.append('description', this.ticketForm.get('ticketBody')?.value);
      formData.append('module', this.choosenModule);
      formData.append('menuPath', JSON.stringify(this.selectedMenupath)); // Stringify the array
      formData.append('productName', this.productname);
      formData.append('prefix', localStorage.getItem('ticketPrefix') || '');
      if (this.ticketForm.get('attachment')?.value) {
        formData.append('file', this.ticketForm.get('attachment')?.value);
      }

      console.log('FormData:', formData);

      this.ticket.createTicket(formData).subscribe({
        next: (response) => {
          console.log('Ticket sent successfully:', response);
          this.ticketForm.reset();
          this.isSubmitted = false; // Reset submission state
          this.isLoading = false
        },
        error: (error) => {
          console.error('Error sending ticket:', error);
          this.isLoading = false
        }
      });
    }

    this.isLoading = false

  }

  onClear(): void {
    this.ticketForm.reset();
    this.isSubmitted = false; // Reset submission state
  }
}