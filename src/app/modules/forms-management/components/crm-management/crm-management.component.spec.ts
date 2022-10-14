import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrmManagementComponent } from './crm-management.component';

describe('CrmManagementComponent', () => {
  let component: CrmManagementComponent;
  let fixture: ComponentFixture<CrmManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrmManagementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrmManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
