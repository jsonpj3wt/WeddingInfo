import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditRegistryComponent } from './edit-registry.component';

describe('EditLocationComponent', () => {
  let component: EditRegistryComponent;
  let fixture: ComponentFixture<EditRegistryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditRegistryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditRegistryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
