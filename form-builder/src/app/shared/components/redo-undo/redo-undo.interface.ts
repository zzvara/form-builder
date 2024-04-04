import { Component } from '@angular/core';

export interface RedoUndoType {
  component: string;
  questionValue?: string;
  answerValue?: Component;
  textareaPlaceholder?: string;
  answerOptions?: string[];
  type: string;
  inputPlaceholder: string;
}
