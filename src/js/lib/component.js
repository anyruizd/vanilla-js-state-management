import Store from '../store/store.js'

export default class Component {
  constructor(props = {}) {
    let self = this
    this.render = this.render || function() {}

    // To make sure that the store prop is a Store class instance 
    // so we can confidently use its methods and properties.
    if(props.store instanceof Store) {
      // Subscribes to the global stateChange event so the object can react. 
      // Calls the render method each time state changes
      props.store.events.subscribe('stateChange', () => self.render())
    }

    if(props.hasOwnProperty('element')) {
      this.element = props.element
    }
  }
}