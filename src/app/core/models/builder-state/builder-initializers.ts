import {
  type ActiveDialogState,
  type BuilderUiState,
  type CodeEditorUiState,
  type DragAndDropState,
  PageStep,
  type StepValidationState,
  StepValidationStatus,
  type ViewportState,
} from './builder-ui-state.model';

export function createInitialBuilderUiState(overrides?: Partial<BuilderUiState>): BuilderUiState {
  return {
    currentStep: PageStep.INFO,
    stepValidation: createInitialStepValidation(),
    selectedComponentId: undefined,
    activeSectionId: undefined,
    inlineEditEnabled: true,
    dialogState: createInitialDialogState(),
    viewport: createInitialViewportState(),
    dragDropState: createInitialDragDropState(),
    canUndo: false,
    canRedo: false,
    ...overrides,
  };
}

export function createInitialDialogState(
  overrides?: Partial<ActiveDialogState>,
): ActiveDialogState {
  return {
    repeatedSectionSettings: { isOpen: false },
    codeEditorModal: { isOpen: false },
    variableModal: { isOpen: false },
    changeSummaryModal: { isOpen: false },
    settingsModal: { isOpen: false },
    ...overrides,
  };
}

export function createInitialDragDropState(
  overrides?: Partial<DragAndDropState>,
): DragAndDropState {
  return {
    isDragging: false,
    hoveredContainerId: undefined,
    draggedItemId: undefined,
    ...overrides,
  };
}

export function createInitialStepValidation(
  overrides?: Partial<StepValidationState>,
): StepValidationState {
  return {
    [PageStep.INFO]: StepValidationStatus.UNKNOWN,
    [PageStep.COMPONENTS]: StepValidationStatus.UNKNOWN,
    [PageStep.RESULTS]: StepValidationStatus.UNKNOWN,
    ...overrides,
  };
}

export function createInitialViewportState(overrides?: Partial<ViewportState>): ViewportState {
  return {
    isMobileView: false,
    ...overrides,
  };
}

export function createCodeEditorUiState(overrides?: Partial<CodeEditorUiState>): CodeEditorUiState {
  return {
    draftCode: '',
    errors: [],
    isValid: true,
    ...overrides,
  };
}
