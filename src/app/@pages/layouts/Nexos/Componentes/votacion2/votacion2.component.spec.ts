import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Votacion2Component } from './votacion2.component';

describe('Votacion2Component', () => {
  let component: Votacion2Component;
  let fixture: ComponentFixture<Votacion2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Votacion2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Votacion2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
