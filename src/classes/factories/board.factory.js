import { BOARD_ITEMS } from '../../constants/board.const.js'
import Cell from '../game/Cell.js'
import Utilities from '../game/Utilities.js'
import Property from '../game/Property.js'
import {generateId} from "../../helpers/helpers.js";
export class boardFactory {
    static generateBoardItem (type, name, price, rent, color) {
        const id = generateId()
        switch (type) {
        case BOARD_ITEMS.AIRPORT:
            return new Utilities(name, id, type, 'airport', price, rent)
        case BOARD_ITEMS.RAILWAY:
            return new Utilities(name, id, type, 'railway', price, rent)
        case BOARD_ITEMS.CITY:
            return new Property(name, id, type, 'city', price, rent, color)
        case BOARD_ITEMS.COMMUNITY_CHEST:
            return new Cell('Community Chest', id, type, 'community-chest')
        case BOARD_ITEMS.CHANCE:
            return new Cell('Chance', id, type, 'chance')
        case BOARD_ITEMS.JAIL:
            return new Cell('Jail', id, type, 'jail')
        case BOARD_ITEMS.TAX:
            return new Cell('Tax', id, type, 'tax')
        case BOARD_ITEMS.FREE_PARKING:
            return new Cell('Free Parking', id, type, 'free-parking')
        case BOARD_ITEMS.GO_TO_JAIL:
            return new Cell('Go to Jail', id, type, 'go-to-jail')
        case BOARD_ITEMS.GO:
            return new Cell('Go', id, type, 'go')
        default:
            return {}
        }
    }
}
