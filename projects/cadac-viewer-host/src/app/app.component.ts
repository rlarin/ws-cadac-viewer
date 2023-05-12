import { AfterViewInit, Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { CadacThree } from 'ngx-cadac-viewer';
import { topMenuItems } from './models/defaults';
import { CsgHandler } from './libs/csgHandler';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit {
  public title = 'cadac-viewer-host';
  public handler: CadacThree = new CadacThree({
    sceneOptions: {
      sceneBackground: '#232323',
    },
  });
  public items: MenuItem[] = topMenuItems;

  ngAfterViewInit(): void {
    CsgHandler(this.handler);
  }
}
