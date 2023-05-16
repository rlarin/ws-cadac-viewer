import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  ViewChild,
} from '@angular/core';
import { CadacThree } from './models/cadac-three';
import { CadacEventDataTypes, CadacObjectData } from './models/types';

@Component({
  selector: 'ngx-cadac-viewer',
  templateUrl: './ngx-cadac-viewer.component.html',
  styleUrls: ['./ngx-cadac-viewer.component.scss'],
})
export class NgxCadacViewerComponent implements AfterViewInit, OnDestroy {
  @Input({ required: true }) cadacThreeHandler: CadacThree;
  @Input({ required: true }) id = '';
  @Output() objectChangedEmitter: EventEmitter<CadacObjectData> =
    new EventEmitter();
  @Output() selectedObjectEmitter: EventEmitter<CadacObjectData> =
    new EventEmitter();
  @ViewChild('cadContainer') cadContainer: ElementRef = new ElementRef(null);

  ngAfterViewInit(): void {
    this.cadacThreeHandler.elRef = this.cadContainer;
    this.cadacThreeHandler.eventSubject$.subscribe(event => {
      const { object } = event.payload;
      switch (event.type) {
        case CadacEventDataTypes.OBJECT_SELECTED:
          this.selectedObjectEmitter.emit({ object });
          break;
        case CadacEventDataTypes.OBJECT_CHANGED:
          this.objectChangedEmitter.emit({
            object,
            position: object.position,
            geometry: object.geometry,
            rotation: object.rotation,
            scale: object.scale,
          });
          break;
      }
    });
  }

  ngOnDestroy(): void {
    this.cadacThreeHandler.dispose();
  }
}
