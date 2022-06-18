import { mount } from '@vue/test-utils'
import Play from '../pages/Play.vue'

describe('Play', () => {
  test('is a Vue instance', () => {
    const wrapper = mount(Play)
    expect(wrapper.vm).toBeTruthy()
  })
})
