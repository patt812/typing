import { mount } from '@vue/test-utils'
import Game from '../components/game_engine/Game.vue'

describe('Game', () => {
  test('can start game', async () => {
    const wrapper = mount(Game);
    const event = { code: 'space' };
    // wrapper.vm.$data.game.isPlayable
    // jest.spyOn(wrapper.element, 'addEventListener').mockImplementation();

    // document.addEventListener("keydown", {
    //   handleEvent: wrapper.vm.$data.game,
    //   game: wrapper.vm.$data.game,
    // });
    // wrapper.trigger('keydown', {
    //   key: 'Space'
    //   // ,
    //   // handleEvent: wrapper.vm.$data.game.start,
    //   // game: wrapper.vm.$data.game
    // });
    await wrapper.vm.$data.game.prepare();
    await wrapper.vm.$data.game.start(event);
    expect(wrapper.vm.$data.game.isPlayable).toBeTruthy();
  })
})
