import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { CadacThree } from './models/cadac-three';

@Component({
  selector: 'ngx-cadac-viewer',
  templateUrl: './ngx-cadac-viewer.component.html',
  styleUrls: ['./ngx-cadac-viewer.component.scss'],
})
export class NgxCadacViewerComponent implements AfterViewInit, OnDestroy {
  @Input() cadacThreeHandler: CadacThree = new CadacThree();
  @Input() id = '';
  @ViewChild('cadContainer') cadContainer: ElementRef = new ElementRef(null);

  ngAfterViewInit(): void {
    this.cadacThreeHandler.elRef = this.cadContainer;
  }

  ngOnDestroy(): void {
    this.cadacThreeHandler.dispose();
  }
}
