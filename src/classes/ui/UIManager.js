import { BOARD_ITEMS } from '../../constants/board.const.js'
import tippy from 'tippy.js'
import { parseHTML } from '../../helpers/helpers.js'

export default class UIManager {
    constructor (dom) {
        this.dom = dom
    }

    initPlayer (player) {
        const playerElement = this.createPlayerElement(player.id, player.color)
        this.dom.getElements('.bottom > div')[0].appendChild(playerElement)

        const playerContainer = this.dom.getElement('.player-container')
        playerContainer.appendChild(this.createPlayerInfoDiv(player))
    }

    updatePlayer (player) {
        const playerElement = this.dom.getElement(`#player-info${player.id}`)
        if (playerElement) {
            playerElement.querySelector('.player-money').textContent = `$${player.money}`

            if (player.properties.length) {
                this.updatePlayerProperties(player.id, player.properties)
            }

            if (player.active) {
                playerElement.classList.add('active')
            } else {
                playerElement.classList.remove('active')
            }
        }
    }

    addPlayerToWelcomeList (player) {
        const listElement = this.dom.getElement('#players')
        const listItem = this.dom.createElement('li', { textContent: player.name })
        const listItemSelectedColor = this.dom.createElement('span', {
            style: `background: ${player.color}`,
            className: 'item-color'
        })
        listItem.appendChild(listItemSelectedColor)
        listElement.appendChild(listItem)
    }

    createPlayerInfoDiv (player) {
        const playerDiv = this.dom.createElement('div', { className: 'player-info', id: `player-info${player.id}` })

        const playerInfoDiv = this.dom.createElement('div', { className: 'player-main' })

        const playerNameDiv = this.dom.createElement('div', { className: 'player-name', textContent: player.name })

        const playerMoneyDiv = this.dom.createElement('div', {
            className: 'player-money',
            textContent: `$${player.money}`
        })

        const playerPropertiesDiv = this.dom.createElement('div', { className: 'player-properties', innerHTML: '<ul></ul>' })

        playerInfoDiv.appendChild(playerNameDiv)
        playerInfoDiv.appendChild(playerMoneyDiv)
        playerDiv.appendChild(playerInfoDiv)
        playerDiv.appendChild(playerPropertiesDiv)

        return playerDiv
    }

    resetUserList () {
        this.dom.getElement('#players').innerHTML = ''
        this.dom.getElement('.player-container').innerHTML = ''
    }

    showPlayersList (show) {
        this.dom.setStyles(this.dom.getElement('#playerList'), { display: show ? 'block' : 'none' })
    }

    updatePlayerProperties (playerId, properties) {
        const playerPropertiesDiv = this.dom.getElement(`#player-info${playerId} .player-properties ul`)
        playerPropertiesDiv.innerHTML = ''
        properties.forEach(property => {
            const propertyLi = this.dom.createElement('li', { textContent: property.name })
            playerPropertiesDiv.appendChild(propertyLi)
        })
    }

    createPlayerElement (id, color) {
        return this.dom.createElement('div', {
            className: 'player',
            id,
            style: `background-color: ${color || 'red'} `
        })
    }

    removePlayer (id) {
        this.dom.removeElement(`#${id}`)
    }

    movePlayerToCell ({ id, color }, i, delay, cells) {
        setTimeout(() => {
            if (this.dom.getElement(`#${id}`)) {
                this.removePlayer(id)
            }
            cells[i].appendChild(this.createPlayerElement(id, color))
        }, delay)
    }

    setupModalElements ({
        headerText,
        bodyText,
        currentBid,
        showInput = false,
        confirmText = 'Confirm',
        cancelText = 'Cancel',
        showCancel = true
    }) {
        const modal = this.dom.getElement('#myModal')
        const modalBody = this.dom.getElement('#modal-body')
        const span = this.dom.getElements('.close')[0]
        modalBody.innerHTML = ''

        const header = this.dom.createElement('h2', { textContent: headerText })
        modalBody.appendChild(header)

        const content = this.dom.createElement('p', { textContent: bodyText })
        modalBody.appendChild(content)

        const input = this.dom.createElement('input', {
            type: 'number',
            step: '5',
            placeholder: 'Your bid',
            value: currentBid + 10,
            style: 'display: block'
        })

        if (showInput) {
            modalBody.appendChild(input)
        }

        const confirmButton = this.dom.createElement('button', {
            textContent: confirmText,
            className: 'modal-button confirm-button'
        })
        modalBody.appendChild(confirmButton)

        const cancelButton = this.dom.createElement('button', {
            textContent: cancelText,
            className: 'modal-button cancel-button'
        })
        if (showCancel) {
            modalBody.appendChild(cancelButton)
        }

        this.dom.addEventListenerToElement(span, 'click', () => this.dom.setStyles({ display: 'none' }))

        this.dom.setStyles(modal, { display: 'block' })

        return { confirmButton, cancelButton, input }
    }

    async openModal ({ headerText, bodyText }) {
        const { confirmButton, cancelButton } = this.setupModalElements({ headerText, bodyText })
        return new Promise(resolve => {
            confirmButton.onclick = () => {
                this.closeModal()
                resolve(true)
            }
            cancelButton.onclick = () => {
                this.closeModal()
                resolve(false)
            }
        })
    }

    async openCardModal ({ headerText, card }) {
        const { confirmButton } = this.setupModalElements({ headerText, bodyText: card.description, showCancel: false })
        return new Promise(resolve => {
            const timeout = setTimeout(() => {
                this.closeModal()
                resolve(true)
            }, 5000)
            confirmButton.onclick = () => {
                this.closeModal()
                clearTimeout(timeout)
                resolve(true)
            }
        })
    }

    async openAuctionModal ({ headerText, bodyText, currentBid }) {
        const { confirmButton, cancelButton, input } = this.setupModalElements({
            headerText,
            bodyText,
            showInput: true,
            currentBid,
            cancelText: 'Pass',
            confirmText: 'Place bid'
        })
        return new Promise(resolve => {
            confirmButton.onclick = () => {
                this.closeModal()
                resolve(Number(input.value))
            }
            cancelButton.onclick = () => {
                this.closeModal()
                resolve(false)
            }
        })
    }

    closeModal () {
        this.dom.setStyles(this.dom.getElement('#myModal'), { display: 'none' })
    }

    createColorElement (item) {
        const boardItemElementColor = this.dom.createElement('div', {
            className: 'color',
            style: `background-color: ${item.color}`
        })
        if (item.id > 0 && item.id < 10) {
            this.dom.addClass(boardItemElementColor, 'color-top')
        }
        if (item.id > 10 && item.id < 20) {
            this.dom.addClass(boardItemElementColor, 'color-right')
        }
        if (item.id > 20 && item.id < 30) {
            this.dom.addClass(boardItemElementColor, 'color-bottom')
        }
        if (item.id > 30 && item.id < 40) {
            this.dom.addClass(boardItemElementColor, 'color-left')
        }
        return boardItemElementColor
    }

    setStylesForBoardElementContent (element, item) {
        if (item.htmlClass) {
            this.dom.addClass(element, item.htmlClass)
        }
    }

    setStylesForBoardElement (element, item) {
        if (item.id === 10 || item.id === 0 || item.id === 20 || item.id === 30) {
            this.dom.addClass(element, 'corner')
        }

        this.dom.setStyles(element, {
            width: '5vw',
            height: '8hv',
            border: '1px'
        })

        if (item.type === BOARD_ITEMS.CITY) {
            if (item.id > 0 && item.id < 10) {
                this.dom.setStyles(element, {
                    backgroundPositionY: '4px'
                })
            }
            if (item.id > 10 && item.id < 20) {
                this.dom.setStyles(element, {
                    backgroundPositionX: '-5px'
                })
            }
            if (item.id > 20 && item.id < 30) {
                this.dom.setStyles(element, {
                    backgroundPositionY: '5px'
                })
            }
            if (item.id > 30 && item.id < 40) {
                this.dom.setStyles(element, {
                    backgroundPositionX: '5px'
                })
            }
        }
    }

    showScreen (status) {
        this.dom.getElement('#welcomeScreen').style.display = status === 'WELCOME' ? 'block' : 'none'
        this.dom.getElement('#playerForm').style.display = status === 'WELCOME' ? 'block' : 'none'
        this.dom.getElement('#startGame').style.display = status === 'WELCOME' ? 'block' : 'none'

        this.dom.getElement('#gameScreen').style.display = status === 'STARTED' ? 'block' : 'none'
        this.dom.getElement('#endGame').style.display = status === 'STARTED' ? 'block' : 'none'
        this.dom.getElement('#dice').style.display = status === 'STARTED' ? 'block' : 'none'
    }

    animateRollDice (callback, dice) {
        this.dom.getElement('#dice').disabled = true
        const diceInstance = dice

        const dice1 = this.dom.getElement('#dice1')
        const dice2 = this.dom.getElement('#dice2')
        const diceContainer = this.dom.getElement('.dice-elements')
        this.dom.setStyles(diceContainer, { opacity: '1' })

        const diceRolls = []

        for (let i = 0; i < 10; i++) {
            setTimeout(() => {
                diceRolls[0] = animateDiceRoll(dice1, diceInstance.die1())
                diceRolls[1] = animateDiceRoll(dice2, diceInstance.die2())

                if (i === 9) {
                    setTimeout(() => {
                        this.dom.setStyles(diceContainer, { opacity: '0' })
                        // eslint-disable-next-line n/no-callback-literal
                        callback(diceRolls[0] + diceRolls[1], diceRolls[0] === diceRolls[1])
                    }, 1000)
                }
            }, i * 100)
        }
        function animateDiceRoll (diceElement, value) {
            diceElement.textContent = value
            return value
        }
    }
}
