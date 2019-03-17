export default class PubSub {
  constructor() {
    this.events = {} // Holds named events
  }

  /**
   * Subscribes the passed callback to the passed event. 
   * @event { String } The event to subscribe to
   * @callback { function } The function to call when a new event is published 
   */
  subscribe(event, callback) {
    let self = this;

    // If there’s not already a matching event in our events collection, 
    // it is created with a blank array 
    if(!self.events.hasOwnProperty(event)) {
      self.events[event] = []
    }

    // Push the callback into the collection
    return self.events[event].push(callback)
  }

  /**
   * Publishes the event, passing the data to its callbacks
   * @param { string } event The event to publish
   * @param {*} data The data to pass to subscribers
   */
  publish(event, data = {}) {
    let self = this

    // checks to see if the passed event exists in our collection. 
    // If not, we return an empty array. 
    if(!self.events.hasOwnProperty(event)) {
      return []
    }

    return self.events[event].map(callback => callback(data))
  }
}

// TODO: Unsubscribe.