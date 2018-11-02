import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditLodgingComponent } from './edit-lodging.component';

describe('EditLocationComponent', () => {
  let component: EditLodgingComponent;
  let fixture: ComponentFixture<EditLodgingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditLodgingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditLodgingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
