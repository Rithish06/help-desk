// toast.service.ts
import { Injectable, TemplateRef } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ToastService {
  toasts: any[] = [];

  // Show standard toast
  show(text: string, options: any = {}) {
    this.toasts.push({ text, ...options });
  }

  // Show success toast
  success(text: string, options: any = {}) {
    this.toasts.push({ text, classname: 'bg-success text-light', ...options });
  }

  // Show error toast
  error(text: string, options: any = {}) {
    this.toasts.push({ text, classname: 'bg-danger text-light', ...options });
  }

  // Show warning toast
  warning(text: string, options: any = {}) {
    this.toasts.push({ text, classname: 'bg-warning text-dark', ...options });
  }

  // Show custom template toast
  showTemplate(template: TemplateRef<any>, options: any = {}) {
    this.toasts.push({ template, ...options });
  }

  // Remove toast
  remove(toast: any) {
    this.toasts = this.toasts.filter(t => t !== toast);
  }

  // Clear all toasts
  clear() {
    this.toasts = [];
  }
}