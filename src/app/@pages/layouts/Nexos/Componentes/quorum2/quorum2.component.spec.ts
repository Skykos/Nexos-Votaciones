import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Quorum2Component } from './quorum2.component';

describe('Quorum2Component', () => {
  let component: Quorum2Component;
  let fixture: ComponentFixture<Quorum2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Quorum2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Quorum2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
