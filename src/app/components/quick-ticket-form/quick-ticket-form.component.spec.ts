import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuickTicketFormComponent } from './quick-ticket-form.component';

describe('QuickTicketFormComponent', () => {
  let component: QuickTicketFormComponent;
  let fixture: ComponentFixture<QuickTicketFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [QuickTicketFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(QuickTicketFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
