import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleApplication } from './single-application';

describe('SingleApplication', () => {
  let component: SingleApplication;
  let fixture: ComponentFixture<SingleApplication>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SingleApplication]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SingleApplication);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
