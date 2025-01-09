export enum MenuOption {
  HOME = 'HOME',
  UNDO = 'UNDO',
  SAVE = 'SAVE',
  SIDEBAR = 'SIDEBAR',
  SETTINGS = 'SETTINGS',
  UPLOAD_JSON = 'UPLOAD_JSON',
}

export interface MenuState {
  options: MenuOption[];
  activeOptions: MenuOption[];
}
