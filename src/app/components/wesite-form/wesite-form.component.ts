import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductsService } from '../../services/products/products.service';
import { TicketService } from '../../services/ticket/ticket.service';

@Component({
  selector: 'app-wesite-form',
  templateUrl: './wesite-form.component.html',
  styleUrls: ['./wesite-form.component.css']
})

export class WesiteFormComponent {
  ticketForm: FormGroup;
  allProducts: any;
  filteredProducts: any;
  formProductName: any;
  pathName: any;
  isSubmitted = false; // Track form submission

  clientName : any
  title : any
  clientId : any
  disabled : boolean = true

  // this choosen path
  choosenPath : any

  constructor(
    private fb: FormBuilder,
    private product: ProductsService,
    private ticket: TicketService
  ) {
    this.ticketForm = this.fb.group({
      title: ['', Validators.required],
      websiteName: ['', Validators.required],
      menuPath: ['', Validators.required],
      ticketBody: ['', [Validators.required, Validators.minLength(10)]],
      attachment: [null]
    });
  }

  ngOnInit() {
    this.clientId = localStorage.getItem('clientId')
    this.clientName = localStorage.getItem('name')
    this.getALlProducts();
  }

  getALlProducts(): void {
    this.product.getAllProducts().subscribe((data: any) => {
      this.allProducts = data;
      this.loadProductName();
    });
  }

  loadProductName(): void {
    const products = localStorage.getItem("products");
    if (this.allProducts) {
      this.filteredProducts = this.allProducts.filter(
        (entry: any) => products?.includes(entry.productId) && entry.productType === 'website'
      );
      this.formProductName = this.filteredProducts.map((entry: any) => ({
        name: entry.name,
        id: entry._id
      }));
    }
  }

  loadMenuPath(): void {
    this.pathName = this.filteredProducts.flatMap((entry: any) => {
      const paths = entry.models?.[0]?.modules?.[0]?.path || [];
      return paths.map((p: any) => ({
        name: p.pathName,
        id: p._id
      }));
    });
    this.ticketForm.get('menuPath')?.reset();
  }

  onchoosingMenuPath(event:any): void{
      const pathName = this.pathName.filter((entry:any) => entry.id === event.target.value).map((entry:any) => entry.name)
      this.choosenPath = pathName[0]
      console.log(pathName)
  }

  onChoosingFile(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.ticketForm.patchValue({ attachment: file });
    }
  }

  onSubmit(): void {
    this.isSubmitted = true; // Mark form as submitted
    if (this.ticketForm.valid) {
      const formData = new FormData();
      formData.append('clientId', localStorage.getItem('clientId') || '');
      formData.append('title', this.ticketForm.get('title')?.value);
      formData.append('description', this.ticketForm.get('ticketBody')?.value);
      formData.append('menuPath', this.choosenPath);
      // formData.append('module', this.ticketForm.get(''));
      if (this.ticketForm.get('attachment')?.value) {
        formData.append('file', this.ticketForm.get('attachment')?.value);
      }

      this.ticket.createTicket(formData).subscribe({
        next: (response) => {
          console.log('Ticket sent successfully:', response);
          this.ticketForm.reset();
          this.isSubmitted = false; // Reset submission state
        },
        error: (error) => {
          console.error('Error sending ticket:', error);
        }
      });
    }
  }

  onClear(): void {
    this.ticketForm.reset();
    this.isSubmitted = false; // Reset submission state
  }
}