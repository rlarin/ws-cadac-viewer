import { TestBed } from '@angular/core/testing';

import { NgxCadacViewerService } from './ngx-cadac-viewer.service';

describe('NgxCadacViewerService', () => {
  let service: NgxCadacViewerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgxCadacViewerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
