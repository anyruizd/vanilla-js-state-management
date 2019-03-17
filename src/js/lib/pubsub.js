export default class PubSub {
  constructor() {
    this.events = {} // Holds named events
  }

  /**
   * Subscribes the passed callback to the passed event. 
   * @param { string } event The event to subscribe to
   * @param { function } callback The function to call when a new event is published 
   * @returns { number } A count of callbacks for this event
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
   * Publishes the event, looping through each event and passing the data to its callbacks
   * @param { string } event The event to publish
   * @param { object } [data={}] The data to pass to subscribers
   * @returns {array} The callbacks for this event, or an empty array if no event exits
   */
  publish(event, data = {}) {
    let self = this

    // checks to see if the passed event exists in our collection. 
    // If not, we return an empty array. 
    if(!self.events.hasOwnProperty(event)) {
      return []
    }

    // Call each subscription callback with the passed data
    return self.events[event].map(callback => callback(data))
  }
}

// TODO: Unsubscribe.