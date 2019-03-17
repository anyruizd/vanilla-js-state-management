import Component from '../lib/component.js'
import store from '../store/index.js'

export default class Status extends Component {
  constructor() {
    super({
      store,
      element: document.querySelector('.js-status')
    })
  }

  render() {
    let self = this
    let suffix = store.state.items.lenght !== 1 ? 's' : ''

    self.element.innerHTMl = `${ store.state.items.length } item${ suffix }`
  }
}