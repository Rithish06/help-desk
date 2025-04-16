import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmmFormComponent } from './smm-form.component';

describe('SmmFormComponent', () => {
  let component: SmmFormComponent;
  let fixture: ComponentFixture<SmmFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SmmFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SmmFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
