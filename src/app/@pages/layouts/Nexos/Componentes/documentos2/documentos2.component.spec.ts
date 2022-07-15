import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Documentos2Component } from './documentos2.component';

describe('Documentos2Component', () => {
  let component: Documentos2Component;
  let fixture: ComponentFixture<Documentos2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Documentos2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Documentos2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
