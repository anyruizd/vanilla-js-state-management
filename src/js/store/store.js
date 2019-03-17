import PubSub from '../lib/pubsub.js'

/**
 * Keeps track of all the changes
 */
export default class Store {
  constructor(params) {
    let self = this

    // Default objects to hold actions, mutations and state
    self.actions = {}
    self.mutations = {}
    self.state = {}

    self.status = 'resting'

    // Attach PubSub module as an `events` element
    self.events = new PubSub()

    // Look in the passed params object for actions and mutations 
    // that might have been passed in 
    if(params.hasOwnProperty('actions')) {
      self.actions = params.actions
    }

    if(params.hasOwnProperty('mutations')) {
      self.mutations = params.mutations
    }

    /**
     * Set state to be a Proxy. 
     * Traps the state object set operations
     * When a mutation runs something like state.name = 'Foo', 
     * this trap catches it before it can be set 
     */
    self.state = new Proxy((params.state || {}), {
      set: function(state, key, value) {
        // Sets the change
        state[key] = value
        console.log(`stateChange: ${key}: ${value}`)

        // Publishes the change event for components that are listening
        // Anything subscribed to the event's callback will be called.
        self.events.publish('stateChange', self.state)

        // If it's not currently running a mutation, it probably means that 
        // the state was updated manually.
        if(self.status !== 'mutation') {
          console.warn(`You should use a mutation to set ${key}`)
        }

        // Reset the status ready for the next operation
        self.status = 'resting'

        // Indicate success
        return true
      }
    })
  }

  /**
   * A dispatcher for actions that looks in the actions 
   * collection and runs the action if it can find it
   * @param { string } actionKey 
   * @param {*} payload
   * @returns { boolean } 
   */
  dispatch(actionKey, payload) {
    let self = this

    // Checks if the action actually exists before try to run it 
    if(typeof self.actions[actionKey] !== 'function') {
      console.error(`Action "${actionKey}" doesn't exist.`)
      return false
    }

    console.groupCollapsed(`ACTION: ${actionKey}`)

    // Let anything that's watching the status know that we're dispatching an action
    self.status = 'action'

    // If action exists, set the status, call the action and pass it 
    // the Store context and whatever payload was passed
    self.actions[actionKey](self, payload)

    console.groupEnd()

    return true
  }

  /**
   * Look for a mutation and modify the state object 
   * if that mutation exists by calling it
   * @param { string } mutationKey 
   * @param {*} payload 
   * @returns { boolean }
   */
  commit(mutationKey, payload) {
    let self = this

    // Check to see if this mutation actually exists before trying to run it
    if(typeof self.mutations[mutationKey] !== 'function') {
      console.log(`Mutation "${mutationKey}" doesn't exist.`)
      return false
    }

    // Let anything that's watching the status know that we're mutating state
    self.status = 'mutation'

    // If the mutation exists, run it and get the new version of the state from its return value.
    let newState = self.mutations[mutationKey](self.state, payload)
    
    // Then merge the new state with existing state to create an up-to-date state version
    self.state = Object.assign(self.state, newState)
    console.log('stateeeee',self.state)
    return true
  }
}