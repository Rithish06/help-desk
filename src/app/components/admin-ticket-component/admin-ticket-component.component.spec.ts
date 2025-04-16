import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminTicketComponentComponent } from './admin-ticket-component.component';

describe('AdminTicketComponentComponent', () => {
  let component: AdminTicketComponentComponent;
  let fixture: ComponentFixture<AdminTicketComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminTicketComponentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminTicketComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
