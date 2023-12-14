import { Component } from '@angular/core';

interface Panel {
  active: boolean;
  name: string;
}

interface Panels {
  [key: string]: Panel;
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent {
  panels: Panels = {
    basic: {
      name: 'Basic inputs',
      active: true,
    },
  };
}
