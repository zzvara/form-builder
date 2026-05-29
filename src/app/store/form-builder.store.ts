import { Injectable, signal, computed } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class FormBuilderStore {
  currentStep = signal<number>(0);

  // Placeholder, validáció még szükséges
  canGoNext = computed(() => true);

  setStep(step: number) {
    if (step < 0 || step > 2) return;
    this.currentStep.set(step);
  }

  next() {
    const current = this.currentStep();
    if (current < 2 && this.canGoNext()) this.currentStep.set(current + 1);
  }

  prev() {
    const current = this.currentStep();
    if (current > 0) this.currentStep.set(current - 1);
  }
}
