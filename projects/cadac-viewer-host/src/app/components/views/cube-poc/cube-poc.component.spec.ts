import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CubePocComponent } from './cube-poc.component';

describe('CubePocComponent', () => {
  let component: CubePocComponent;
  let fixture: ComponentFixture<CubePocComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CubePocComponent],
    });
    fixture = TestBed.createComponent(CubePocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
