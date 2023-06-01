import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DragDropPrimitivesComponent } from './drag-drop-primitives.component';

describe('DragDropPrimitivesComponent', () => {
  let component: DragDropPrimitivesComponent;
  let fixture: ComponentFixture<DragDropPrimitivesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DragDropPrimitivesComponent]
    });
    fixture = TestBed.createComponent(DragDropPrimitivesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
