import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Shares } from './shares';

describe('Shares', () => {
  let component: Shares;
  let fixture: ComponentFixture<Shares>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Shares]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Shares);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
