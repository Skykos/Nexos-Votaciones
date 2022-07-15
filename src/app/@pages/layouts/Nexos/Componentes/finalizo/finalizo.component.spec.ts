import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FinalizoComponent } from './finalizo.component';

describe('FinalizoComponent', () => {
  let component: FinalizoComponent;
  let fixture: ComponentFixture<FinalizoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FinalizoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FinalizoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
