import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrevioComponent } from './previo.component';

describe('PrevioComponent', () => {
  let component: PrevioComponent;
  let fixture: ComponentFixture<PrevioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrevioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrevioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
