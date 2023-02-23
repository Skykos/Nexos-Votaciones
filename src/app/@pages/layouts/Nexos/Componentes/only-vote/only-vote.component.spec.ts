import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OnlyVoteComponent } from './only-vote.component';

describe('OnlyVoteComponent', () => {
  let component: OnlyVoteComponent;
  let fixture: ComponentFixture<OnlyVoteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OnlyVoteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OnlyVoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
