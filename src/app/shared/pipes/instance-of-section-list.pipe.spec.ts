import { InstanceOfSectionListPipe } from './instance-of-section-list.pipe';
import { inputFixture, sectionFixture } from '@app/testing/fixtures';

describe('InstanceOfSectionListPipe', () => {
  it('recognizes sections and preserves their existing data', () => {
    const section = sectionFixture('section', [inputFixture()]);
    const original = structuredClone(section);
    expect(new InstanceOfSectionListPipe().transform(section)).toBeTrue();
    expect(section).toEqual(original);
  });

  it('initializes legacy section defaults', () => {
    const section = { id: 'legacy', type: 'SectionComponent' };
    expect(new InstanceOfSectionListPipe().transform(section)).toBeTrue();
    expect(section).toEqual(
      jasmine.objectContaining({ sectionId: 'legacy', layout: 'vertical', sectionInputs: [] }),
    );
  });
  
  it('rejects absent and non-section values', () => {
    const pipe = new InstanceOfSectionListPipe();
    for (const value of [null, undefined, 3, '', {}, inputFixture()])
      expect(pipe.transform(value)).toBeFalse();
  });
});
