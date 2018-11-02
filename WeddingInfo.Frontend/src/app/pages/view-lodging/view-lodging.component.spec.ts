import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewLodgingComponent } from './view-lodging.component';

describe('ViewLocationComponent', () => {
  let component: ViewLodgingComponent;
  let fixture: ComponentFixture<ViewLodgingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewLodgingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewLodgingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
