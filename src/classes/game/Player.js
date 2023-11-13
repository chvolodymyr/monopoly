import { getCells } from '../../helpers/helpers.js'

export default class Player {
    constructor (name, id, color, ui) {
        this.name = name
        this.id = id
        this.inJail = false
        this.money = 1000
        this.position = 0
        this.properties = []
        this.jailFreeCard = false
        this.color = color
        this.ui = ui
        this.active = false
    }

    remove () {
        getCells()[this.position].remove()
    }

    moveTo (diceNumber, directMove = false) {
        return new Promise(resolve => {
            const cells = getCells()

            if (directMove) {
                this.ui.movePlayerToCell(this, diceNumber, 1000, cells)
                this.position = diceNumber
                resolve()
            } else {
                if (!diceNumber) {
                    resolve()
                    return
                }

                let newPosition

                if (directMove) {
                    newPosition = diceNumber
                } else {
                    newPosition = (this.position + diceNumber) % 40
                }

                let currentDelay = 800
                const totalDelay = currentDelay + diceNumber * 200
                if (directMove || this.position <= newPosition) {
                    for (let i = this.position; i <= newPosition; i++) {
                        this.ui.movePlayerToCell(this, i, currentDelay, cells)
                        currentDelay += 100
                        if (i === newPosition) break
                    }
                } else {
                    for (let i = this.position; i <= 39; i++) {
                        this.ui.movePlayerToCell(this, i, currentDelay, cells)
                        currentDelay += 100
                    }
                    for (let i = 0; i <= newPosition; i++) {
                        this.ui.movePlayerToCell(this, i, currentDelay, cells)
                        currentDelay += 100
                    }
                }
                setTimeout(() => {
                    this.position = newPosition
                    resolve()
                }, totalDelay)
            }
        })
    }

    addProperty (property) {
        if (property.ownerId === this.id) {
            this.properties.push(property)
        }
    }

    goToJail () {
        this.inJail = true
    }

    useJailFreeCard () {
        this.jailFreeCard = false
    }
}
