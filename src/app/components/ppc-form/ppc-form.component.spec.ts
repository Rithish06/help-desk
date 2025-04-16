import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PpcFormComponent } from './ppc-form.component';

describe('PpcFormComponent', () => {
  let component: PpcFormComponent;
  let fixture: ComponentFixture<PpcFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PpcFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PpcFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
