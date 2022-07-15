import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Votaciones2Component } from './votaciones2.component';

describe('Votaciones2Component', () => {
  let component: Votaciones2Component;
  let fixture: ComponentFixture<Votaciones2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Votaciones2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Votaciones2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
