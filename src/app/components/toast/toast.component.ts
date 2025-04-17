import { Component, TemplateRef } from '@angular/core';
import { ToastService } from '../../services/toast/toast.service';

@Component({
  selector: 'app-toast',
  template: `
   
  `,
  host: { '[class.ngb-toasts]': 'true' }
})

export class ToastComponent {
  constructor(public toastService: ToastService) {}

  ngOnInit(){
    console.log("toast")
  }
    
  isTemplate(toast: any): boolean {
    return toast.template instanceof TemplateRef;
  }
}