import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxCadacViewerComponent } from './ngx-cadac-viewer.component';

describe('NgxCadacViewerComponent', () => {
  let component: NgxCadacViewerComponent;
  let fixture: ComponentFixture<NgxCadacViewerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NgxCadacViewerComponent],
    });
    fixture = TestBed.createComponent(NgxCadacViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
