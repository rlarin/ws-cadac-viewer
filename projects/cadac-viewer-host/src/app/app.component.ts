import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { topMenuItems } from './models/defaults';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  public title = 'cadac-viewer-host';
  public items: MenuItem[] = topMenuItems;
}
