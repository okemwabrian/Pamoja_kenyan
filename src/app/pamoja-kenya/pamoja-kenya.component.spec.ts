import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';

import { PamojaKenyaComponent } from './pamoja-kenya.component';

describe('PamojaKenyaComponent', () => {
  let component: PamojaKenyaComponent;
  let fixture: ComponentFixture<PamojaKenyaComponent>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PamojaKenyaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should compile', () => {
    expect(component).toBeTruthy();
  });
});
