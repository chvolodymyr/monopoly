import Cell from './Cell.js'

export default class Utilities extends Cell {
    constructor (name, id, type, htmlClass, price, rent) {
        super(name, id, type, htmlClass)
        this.price = price
        this.rent = rent
        this.ownerId = null
    }

    getOwner () {
        return this.ownerId
    }

    setOwner (player) {
        this.ownerId = player.id
        player.addProperty(this)
    }

    getRentPrice (diceNumber) {
        return this.price * diceNumber
    }
}
