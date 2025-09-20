import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoubleApplication } from './double-application';

describe('DoubleApplication', () => {
  let component: DoubleApplication;
  let fixture: ComponentFixture<DoubleApplication>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DoubleApplication]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DoubleApplication);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
