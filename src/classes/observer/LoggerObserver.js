import Observer from './Observer.js'

export default class LoggerObserver extends Observer {
    update (data) {
        console.log(data)
    }
}
