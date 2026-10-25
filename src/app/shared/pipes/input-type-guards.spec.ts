import { LayoutEnum } from '@pages/edit/interfaces/layout-enum';
import { InstanceOfFormInputDataPipe } from './instance-of-form-input-data.pipe';
import { InstanceOfRepeatedSectionPipe } from './instance-of-repeated-section.pipe';
import { InstanceOfSectionListPipe } from './instance-of-section-list.pipe';

describe('input type guards', () => {
  const inputPipe = new InstanceOfFormInputDataPipe();
  const sectionPipe = new InstanceOfSectionListPipe();
  const repeatedPipe = new InstanceOfRepeatedSectionPipe();

  it('rejects null and primitive values without throwing', () => {
    for (const value of [null, undefined, false, 0, 'input']) {
      expect(inputPipe.transform(value)).toBeFalse();
      expect(sectionPipe.transform(value)).toBeFalse();
      expect(repeatedPipe.transform(value)).toBeFalse();
    }
  });

  it('distinguishes an input from its edit-list wrapper', () => {
    const input = { title: 'Question', type: 'InputComponent', data: { id: 'input' } };
    expect(inputPipe.transform(input)).toBeTrue();
    expect(inputPipe.transform({ id: 'input', data: input })).toBeFalse();
  });

  it('initializes defaults on legacy section data', () => {
    const section: unknown = { id: 'section', type: 'SectionComponent' };
    if (!sectionPipe.transform(section)) throw new Error('Section was not recognized');
    expect(section.sectionId).toBe('section');
    expect(section.layout).toBe(LayoutEnum.VERTICAL);
    expect(section.sectionInputs).toEqual([]);
  });

  it('initializes missing repeated settings and preserves valid ones', () => {
    const missing: unknown = { type: 'RepeatedSectionComponent' };
    if (!repeatedPipe.transform(missing)) throw new Error('Repeated section was not recognized');
    expect(missing.repeatByOther).toBeFalse();
    expect(missing.repeatTimes).toBe(1);
    expect(missing.referencableInputs).toEqual([]);

    const existing = {
      type: 'RepeatedSectionComponent',
      repeatByOther: true,
      repeatTimes: 3,
      referencableInputs: ['Count'],
    };
    expect(repeatedPipe.transform(existing)).toBeTrue();
    expect(existing.repeatByOther).toBeTrue();
    expect(existing.repeatTimes).toBe(3);
    expect(existing.referencableInputs).toEqual(['Count']);
  });
});
