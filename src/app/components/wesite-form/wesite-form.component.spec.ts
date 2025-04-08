import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WesiteFormComponent } from './wesite-form.component';

describe('WesiteFormComponent', () => {
  let component: WesiteFormComponent;
  let fixture: ComponentFixture<WesiteFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WesiteFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WesiteFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
