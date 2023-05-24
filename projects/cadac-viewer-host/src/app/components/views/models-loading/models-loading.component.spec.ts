import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelsLoadingComponent } from './models-loading.component';

describe('ModelsLoadingComponent', () => {
  let component: ModelsLoadingComponent;
  let fixture: ComponentFixture<ModelsLoadingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModelsLoadingComponent],
    });
    fixture = TestBed.createComponent(ModelsLoadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
