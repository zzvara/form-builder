export interface ContextAction {
  id: string;
  label: string;
  icon?: string;
  type: 'default' | 'primary' | 'dashed' | 'link';
  disabled?: boolean;
  callback: () => void;
}
