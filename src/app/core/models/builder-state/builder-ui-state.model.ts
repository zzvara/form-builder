/**
 * Represents the steps in the form creation flow
 */
export enum PageStep {
  INFO = 0,
  COMPONENTS = 1,
  RESULTS = 2,
}

export enum StepValidationStatus {
  UNKNOWN = 'unknown',
  VALID = 'valid',
  INVALID = 'invalid',
}

/**
 * Validation and draft status during editing
 */
export type StepValidationState = Record<PageStep, StepValidationStatus>;

/**
 * For accurately modeling dialog state
 */
export interface ClosedDialog {
  isOpen: false;
}

export type OpenDialog<T = void> = { isOpen: true } & (T extends void ? object : T);

export type DialogState<T = void> = ClosedDialog | OpenDialog<T>;

/**
 * Tracks the open/closed state of modals and drawers in the editor
 */
export interface ActiveDialogState {
  /** The bottom drawer in mobile view for repeated section settings */
  repeatedSectionSettings: DialogState<{ sectionId: string }>;

  /** The custom condition/code-editor modal */
  codeEditorModal: DialogState<{ componentId: string }>;

  /** Variable picker modal opened from inside the code editor */
  variableModal: DialogState<{ componentId: string }>;

  /** The version change-summary modal */
  changeSummaryModal: DialogState<{ versionNum?: number }>;

  /** The per-component settings modal */
  settingsModal: DialogState<{ componentId: string }>;
}

/**
 * Viewport and canvas preview configuration.
 */
export interface ViewportState {
  /** Whether the user is viewing the canvas in mobile view */
  isMobileView: boolean;
}

/**
 * Tracks drag-and-drop and responsive layout states
 */
export interface DragAndDropState {
  /** Whether a component is currently being dragged */
  isDragging: boolean;
  /** ID of the container currently being hovered over */
  hoveredContainerId?: string;
  /** Type or ID of the item currently being dragged */
  draggedItemId?: string;
}

/**
 * Diagnostic error produced by JSHint / CodeMirror
 */
export interface CodeEditorError {
  from: number;
  to: number;
  code: string;
  reason: string;
  a?: string;
  b?: string;
  c?: string;
  d?: string;
}

export interface CodeEditorUiState {
  /** Unsaved code in the text editor before clicking save */
  draftCode: string;
  /** Current syntax/lint errors highlighted in the editor */
  errors: CodeEditorError[];
  /** Whether the current draft code is valid JavaScript */
  isValid: boolean;
}

/**
 * Representation of the Builder UI State.
 */
export interface BuilderUiState {
  /** Current page step */
  currentStep: PageStep;

  /** Validation status of the steps */
  stepValidation: StepValidationState;

  /**
   * Currently selected/focused field or section ID on the canvas
   * If the component is inside a section, then the ID of the including section can be stored too
   */
  selectedComponentId?: string;
  activeSectionId?: string;

  /** Whether inline editing mode is enabled */
  inlineEditEnabled: boolean;

  /** Modals, popovers, and drawer state */
  dialogState: ActiveDialogState;

  /** Whether the user is viewing the canvas in mobile emulation mode */
  viewport: ViewportState;

  /** Drag-and-drop UI behavior */
  dragDropState: DragAndDropState;

  /** History availability */
  canUndo: boolean;
  canRedo: boolean;

  /** Code editor state for conditional rendering */
  codeEditorState?: CodeEditorUiState;
}
