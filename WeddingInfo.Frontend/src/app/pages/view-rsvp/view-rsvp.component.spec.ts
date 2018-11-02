import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewRsvpComponent } from './view-rsvp.component';

describe('ViewRsvpComponent', () => {
  let component: ViewRsvpComponent;
  let fixture: ComponentFixture<ViewRsvpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewRsvpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewRsvpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
