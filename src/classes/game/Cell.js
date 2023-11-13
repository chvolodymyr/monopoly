import { BOARD_ITEMS } from '../../constants/board.const.js'

export default class Cell {
    constructor (name, id, type, htmlClass) {
        this.name = name
        this.id = id
        this.type = type
        this.htmlClass = htmlClass
        this.elementId = `cell${id}`
    }

    getName () {
        return this.name
    }

    isCellPropertyForSell () {
        return (this.type === BOARD_ITEMS.CITY || this.type === BOARD_ITEMS.RAILWAY || this.type === BOARD_ITEMS.AIRPORT) && this.price
    }

    isCellTax () {
        return this.type === BOARD_ITEMS.TAX
    }

    isCellChance () {
        return this.type === BOARD_ITEMS.CHANCE
    }

    isCellCommunityChest () {
        return this.type === BOARD_ITEMS.COMMUNITY_CHEST
    }

    isGoToJail () {
        return this.type === BOARD_ITEMS.GO_TO_JAIL
    }

    isJail () {
        return this.type === BOARD_ITEMS.JAIL
    }

    isFreeParking () {
        return this.type === BOARD_ITEMS.FREE_PARKING
    }
}
