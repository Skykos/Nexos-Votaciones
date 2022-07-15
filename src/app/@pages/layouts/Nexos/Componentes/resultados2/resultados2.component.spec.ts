import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Resultados2Component } from './resultados2.component';

describe('Resultados2Component', () => {
  let component: Resultados2Component;
  let fixture: ComponentFixture<Resultados2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Resultados2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Resultados2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
