import {
  createCodeEditorUiState,
  createInitialBuilderUiState,
  createInitialDialogState,
  createInitialDragDropState,
  createInitialStepValidation,
  createInitialViewportState,
} from './builder-initializers';
import { PageStep, StepValidationStatus } from './builder-ui-state.model';

describe('builder-initializers', () => {
  describe('createInitialStepValidation', () => {
    it('initializes all PageStep entries as UNKNOWN and supports overrides', () => {
      const state = createInitialStepValidation();

      expect(state).toEqual({
        [PageStep.INFO]: StepValidationStatus.UNKNOWN,
        [PageStep.COMPONENTS]: StepValidationStatus.UNKNOWN,
        [PageStep.RESULTS]: StepValidationStatus.UNKNOWN,
      });

      const overridden = createInitialStepValidation({
        [PageStep.INFO]: StepValidationStatus.VALID,
        [PageStep.COMPONENTS]: StepValidationStatus.INVALID,
      });

      expect(overridden).toEqual({
        [PageStep.INFO]: StepValidationStatus.VALID,
        [PageStep.COMPONENTS]: StepValidationStatus.INVALID,
        [PageStep.RESULTS]: StepValidationStatus.UNKNOWN,
      });
    });
  });

  describe('createInitialDialogState', () => {
    it('initializes all dialogs as closed and accepts open dialog overrides', () => {
      const initial = createInitialDialogState();

      expect(initial).toEqual({
        repeatedSectionSettings: { isOpen: false },
        codeEditorModal: { isOpen: false },
        variableModal: { isOpen: false },
        changeSummaryModal: { isOpen: false },
        settingsModal: { isOpen: false },
      });

      const withOpen = createInitialDialogState({
        codeEditorModal: { isOpen: true, componentId: 'field-1' },
        changeSummaryModal: { isOpen: true, versionNum: 3 },
      });

      expect(withOpen.codeEditorModal).toEqual({ isOpen: true, componentId: 'field-1' });
      expect(withOpen.changeSummaryModal).toEqual({ isOpen: true, versionNum: 3 });
      expect(withOpen.settingsModal).toEqual({ isOpen: false });
    });
  });

  describe('createInitialViewportState', () => {
    it('defaults to desktop view and supports overrides', () => {
      expect(createInitialViewportState()).toEqual({ isMobileView: false });
      expect(createInitialViewportState({ isMobileView: true })).toEqual({ isMobileView: true });
    });
  });

  describe('createInitialDragDropState', () => {
    it('defaults to not dragging and supports overrides', () => {
      expect(createInitialDragDropState()).toEqual({
        isDragging: false,
        hoveredContainerId: undefined,
        draggedItemId: undefined,
      });

      expect(
        createInitialDragDropState({
          isDragging: true,
          hoveredContainerId: 'section-1',
          draggedItemId: 'field-2',
        }),
      ).toEqual({
        isDragging: true,
        hoveredContainerId: 'section-1',
        draggedItemId: 'field-2',
      });
    });
  });

  describe('createCodeEditorUiState', () => {
    it('initializes empty valid draft state with a fresh errors array and supports overrides', () => {
      const first = createCodeEditorUiState();
      const second = createCodeEditorUiState();

      expect(first).toEqual({
        draftCode: '',
        errors: [],
        isValid: true,
      });
      expect(first.errors).not.toBe(second.errors);

      const withErrors = createCodeEditorUiState({
        draftCode: 'const x = ;',
        isValid: false,
        errors: [{ from: 10, to: 11, code: 'E030', reason: 'Expected an identifier.' }],
      });

      expect(withErrors.draftCode).toBe('const x = ;');
      expect(withErrors.isValid).toBeFalse();
      expect(withErrors.errors.length).toBe(1);
    });
  });

  describe('createInitialBuilderUiState', () => {
    it('initializes complete default builder UI state with fresh nested objects', () => {
      const first = createInitialBuilderUiState();
      const second = createInitialBuilderUiState();

      expect(first.currentStep).toBe(PageStep.INFO);
      expect(first.stepValidation).toEqual({
        [PageStep.INFO]: StepValidationStatus.UNKNOWN,
        [PageStep.COMPONENTS]: StepValidationStatus.UNKNOWN,
        [PageStep.RESULTS]: StepValidationStatus.UNKNOWN,
      });
      expect(first.selectedComponentId).toBeUndefined();
      expect(first.activeSectionId).toBeUndefined();
      expect(first.inlineEditEnabled).toBeTrue();
      expect(first.dialogState).toEqual(createInitialDialogState());
      expect(first.viewport).toEqual({ isMobileView: false });
      expect(first.dragDropState).toEqual(createInitialDragDropState());
      expect(first.canUndo).toBeFalse();
      expect(first.canRedo).toBeFalse();
      expect(first.codeEditorState).toBeUndefined();

      expect(first.stepValidation).not.toBe(second.stepValidation);
      expect(first.dialogState).not.toBe(second.dialogState);
      expect(first.viewport).not.toBe(second.viewport);
      expect(first.dragDropState).not.toBe(second.dragDropState);
    });

    it('applies top-level overrides', () => {
      const codeEditorState = createCodeEditorUiState({ draftCode: 'return true;' });
      const state = createInitialBuilderUiState({
        currentStep: PageStep.COMPONENTS,
        selectedComponentId: 'comp-1',
        activeSectionId: 'sec-1',
        inlineEditEnabled: false,
        canUndo: true,
        codeEditorState,
      });

      expect(state.currentStep).toBe(PageStep.COMPONENTS);
      expect(state.selectedComponentId).toBe('comp-1');
      expect(state.activeSectionId).toBe('sec-1');
      expect(state.inlineEditEnabled).toBeFalse();
      expect(state.canUndo).toBeTrue();
      expect(state.canRedo).toBeFalse();
      expect(state.codeEditorState).toBe(codeEditorState);
    });
  });
});
