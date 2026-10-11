import { InstanceOfFormInputDataPipe } from './instance-of-form-input-data.pipe';
import { inputFixture, sectionFixture } from '@app/testing/fixtures';

describe('InstanceOfFormInputDataPipe', () => {
  it('recognizes plain and wrapped input definitions', () => {
    const pipe = new InstanceOfFormInputDataPipe();
    const input = inputFixture();
    expect(pipe.transform(input)).toBeTrue();
    expect(pipe.transform({ id: 'wrapper', data: input })).toBeTrue();
    expect(pipe.transform(sectionFixture())).toBeFalse();
  });
  
  it('safely rejects absent, primitive, and incomplete values', () => {
    const pipe = new InstanceOfFormInputDataPipe();
    for (const value of [null, undefined, '', 3, {}, { data: 'bad' }]) {
      expect(pipe.transform(value)).toBeFalse();
    }
  });
});
