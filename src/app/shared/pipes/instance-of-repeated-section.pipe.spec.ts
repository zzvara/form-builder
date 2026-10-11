import { InstanceOfRepeatedSectionPipe } from './instance-of-repeated-section.pipe';

describe('InstanceOfRepeatedSectionPipe', () => {
  it('initializes repeat settings with a minimum of one repetition', () => {
    const section = { type: 'RepeatedSectionComponent', repeatTimes: 0 };
    expect(new InstanceOfRepeatedSectionPipe().transform(section)).toBeTrue();
    expect(section).toEqual(
      jasmine.objectContaining({ repeatTimes: 1, repeatByOther: false, referencableInputs: [] }),
    );
  });
  
  it('preserves valid settings and rejects non-sections', () => {
    const section = {
      type: 'RepeatedSectionComponent',
      repeatTimes: 3,
      repeatByOther: true,
      referencableInputs: ['count'],
    };
    const original = structuredClone(section);
    const pipe = new InstanceOfRepeatedSectionPipe();
    expect(pipe.transform(section)).toBeTrue();
    expect(section).toEqual(original);
    for (const value of [null, undefined, {}, { type: 'SectionComponent' }])
      expect(pipe.transform(value)).toBeFalse();
  });
});
