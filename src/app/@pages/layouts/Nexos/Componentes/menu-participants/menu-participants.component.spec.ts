import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuParticipantsComponent } from './menu-participants.component';

describe('MenuParticipantsComponent', () => {
  let component: MenuParticipantsComponent;
  let fixture: ComponentFixture<MenuParticipantsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MenuParticipantsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuParticipantsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
