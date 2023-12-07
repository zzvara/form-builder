export enum MenuOption {
  HOME = 'HOME',
  UNDO = 'UNDO',
  SAVE = 'SAVE',
  SIDEBAR = 'SIDEBAR',
  SETTINGS = 'SETTINGS',
}

export interface MenuState {
  options: MenuOption[];
  activeOptions: MenuOption[];
}
