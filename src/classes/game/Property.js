import Cell from './Cell.js'

export default class Property extends Cell {
    constructor (name, id, type, htmlClass, price, rent, color) {
        super(name, id, type, htmlClass)
        this.price = price
        this.rent = rent
        this.ownerId = null
        this.color = color
    }

    getOwner () {
        return this.ownerId
    }

    setOwner (player) {
        this.ownerId = player.id
        player.addProperty(this)
    }

    getPropertyPrice () {
        return this.price
    }
}
