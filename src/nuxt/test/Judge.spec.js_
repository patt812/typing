import { mount } from '@vue/test-utils'
import Judge from '../components/game_engine/judge';

describe('Judge unit test', () => {
  let judge = new Judge();
  beforeEach(() => {
    judge = new Judge();
  });

  test('judge wrong input', () => {
    const pattern = [["i", "yi"]];

    judge.do('a', pattern);
    expect(judge.isCorrect).toBeFalsy();
    expect(judge.patternIndex).toEqual(0);
    expect(judge.charIndex).toEqual(0);
  });

  test('judge correct input', () => {
    const pattern = [["i", "yi"]];

    judge.do('y', pattern);
    expect(judge.isCorrect).toBeTruthy();
    expect(judge.patternIndex).toEqual(0);
    expect(judge.charIndex).toEqual(1);
  });

  test('judge whole sentence', () => {
    const pattern = [["i", "yi"]];

    judge.do('y', pattern);
    expect(judge.isCorrect).toBeTruthy();
    expect(judge.patternIndex).toEqual(0);
    expect(judge.charIndex).toEqual(1);

    judge.do('i', pattern);
    expect(judge.isCorrect).toBeTruthy();
    expect(judge.patternIndex).toEqual(0);
    expect(judge.charIndex).toEqual(0);
  });
})
