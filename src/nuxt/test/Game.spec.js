import { mount } from '@vue/test-utils'
import Game from '../components/game_engine/game';

describe('Game initialize', () => {
  const game = new Game();
  document.addEventListener("keydown", {
    handleEvent: game.start,
    game: game,
  });

  // jest.spyOn(document, 'addEventListener').mockImplementationOnce((event, handler, options) => {
  //   const gen = handler({
  //     handleEvent: game.start,
  //     game: game,
  //   });
  //   // rval = gen.next().value;
  // });
  // jest.spyOn(document, 'addEventListener').mockImplementation();
  // document.addEventListener("keydown", {
  //   handleEvent: game.start,
  //   game: game,
  // });
  // const key = new KeyboardEvent('keydown', { code: 'Space' });
  test('is game prepared', async () => {
    await game.prepare();
    expect(game.isPlayable).toBeTruthy();
  });


  test('can start game', async () => {
    // await new Promise((resolve, reject) => {
    document.dispatchEvent(new KeyboardEvent('keydown', { code: 'Space' }));
    //   if (game.played != 0)
    //     resolve();
    // });

    // await game.start(eventStab);
    expect(game.isStarted).toBeTruthy();
    expect(game.played).toBe(1);
  })

  test('can observe playing', () => {
    const correctInput = game.sentence.romas[0][0].substr(0, 1);
    const wrongInput = (correctInput === 'a') ? 'b' : 'a';

    expect(game.isStarted).toBeTruthy();
    expect(game.played).toBeGreaterThanOrEqual(1);

    document.dispatchEvent(new KeyboardEvent('keydown', { key: wrongInput }));
    expect(game.judge.isCorrect).toBeFalsy();
    expect(game.statistics.mistake).toEqual(1);

    document.dispatchEvent(new KeyboardEvent('keydown', { key: correctInput }));
    expect(game.judge.isCorrect).toBeTruthy();
    expect(game.statistics.mistake).toEqual(1);
    expect(game.statistics.correct).toEqual(1);

    document.dispatchEvent(new KeyboardEvent('keydown', { key: "Escape" }));
    expect(game.isStarted).toBeTruthy();
  });
})

describe('Game methods', () => {
  
});
