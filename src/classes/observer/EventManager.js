export default class EventManager {
    constructor () {
        this.observers = {}
    }

    subscribe (eventType, observer) {
        if (!this.observers[eventType]) {
            this.observers[eventType] = []
        }
        this.observers[eventType].push(observer)
    }

    unsubscribe (eventType, observer) {
        if (this.observers[eventType]) {
            this.observers[eventType] = this.observers[eventType].filter(subscriber => subscriber === observer)
        }
    }

    notify (eventType, data) {
        if (this.observers[eventType]) {
            this.observers[eventType].forEach(subscriber => subscriber.update(data))
        }
    }
}
