export interface ValidationRule {
  id?: string;
  type?: string;
  message?: string;
}

export interface VisibilityRule {
  id?: string;
  targetFieldId?: string;
  condition?: string;
  value?: unknown;
}