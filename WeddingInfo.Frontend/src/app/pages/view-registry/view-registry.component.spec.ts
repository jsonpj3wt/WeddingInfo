import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewRegistryComponent } from './view-registry.component';

describe('ViewLocationComponent', () => {
  let component: ViewRegistryComponent;
  let fixture: ComponentFixture<ViewRegistryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewRegistryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewRegistryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
