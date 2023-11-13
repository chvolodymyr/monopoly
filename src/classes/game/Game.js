import { movementEvent } from '../../helpers/helpers.js'

export default class Game {
    constructor (board, ui, banker, eventManager, communityChestCards, chanceCards, dice) {
        this.board = board
        this.eventManager = eventManager
        this.ui = ui
        this.banker = banker
        this.players = []
        this.dice = dice.getInstance()
        this.communityChestCards = communityChestCards
        this.chanceCards = chanceCards
        this.status = 'WELCOME'
        this.currentPlayerIndex = 0
        this.auctionState = null
    }

    startGame () {
        if (this.players < 2) {
            throw Error('Cant start game ')
        }
        this.status = 'STARTED'
        this.ui.showScreen(this.status)
        this.determinateStartPlayer()
    }

    endGame () {
        this.status = 'WELCOME'
        this.reset()
        this.ui.showScreen(this.status)
    }

    determinateStartPlayer () {
        this.currentPlayerIndex = Math.floor(Math.random() * this.players.length)
        this.players[this.currentPlayerIndex].active = true
        this.updatePlayers()
        this.eventManager.notify('userInteraction', `Player ${this.getCurrentPlayer().name} start his turn`)
    }

    endTurn () {
        this.updatePlayers()
        document.dispatchEvent(movementEvent)
        this.eventManager.notify('userInteraction', `${this.getCurrentPlayer().name} ends his turn`)
        this.switchPlayer()
    }

    updatePlayers () {
        this.players.forEach(res => this.ui.updatePlayer(res))
    }

    addPlayer (player) {
        this.players.push(player)
        this.ui.showPlayersList(!!this.players.length)
        this.ui.initPlayer(player)
        this.ui.addPlayerToWelcomeList(player)
    }

    getCurrentPlayer () {
        return this.players[this.currentPlayerIndex]
    }

    getPlayerById (id) {
        return this.players.find(res => res.id === id)
    }

    switchPlayer () {
        this.players[this.currentPlayerIndex].active = false
        this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length
        this.players[this.currentPlayerIndex].active = true
        this.updatePlayers()
        this.eventManager.notify('userInteraction', `Player ${this.getCurrentPlayer().name} start his turn`)
    }

    reset () {
        this.players.forEach(player => this.ui.removePlayer(player.id))
        this.players = []
        this.currentPlayerIndex = 0
        this.ui.showPlayersList(false)
        this.ui.resetUserList()
    }

    startAuction (property) {
        this.eventManager.notify('userInteraction', `Auction for ${property.name} started!`)

        this.auctionState = {
            property,
            highestBid: 0,
            highestBidder: null,
            activePlayers: [...this.players.filter(res => this.getCurrentPlayer().id !== res.id)], // Clone the players array if needed
            bids: new Map() // Keeps track of each player's latest bid
        }
        if (this.auctionState.activePlayers.length === 1) {
            this.handleSinglePlayerAuction(this.auctionState.activePlayers[0], property)
        } else {
            this.getNextBid()
        }
    }

    async getNextBid (property) {
        if (!this.auctionState.activePlayers.length) {
            this.endAuction()
            return null
        }

        const nextPlayer = this.auctionState.activePlayers.shift()

        const bid = await this.ui.openAuctionModal({
            headerText: `Auction for ${this.auctionState.property.name}.`,
            bodyText: `Current bid is ${this.auctionState.highestBidder ? this.auctionState.highestBidder.name : ''} ${this.auctionState.highestBid}$ \n
            ${nextPlayer.name}   enter your bid: `,
            currentBid: this.auctionState.highestBid
        })

        if ((bid && bid > this.auctionState.highestBid)) {
            this.auctionState.highestBid = bid
            this.auctionState.highestBidder = nextPlayer
            this.auctionState.bids.set(nextPlayer.id, bid)
            this.auctionState.activePlayers.push(nextPlayer)

            this.eventManager.notify('userInteraction', `${nextPlayer.name} made bid ${bid}`)
        } else {
            this.eventManager.notify('userInteraction', `${nextPlayer.name} has passed or bid too low.`)
        }

        if (this.auctionState.activePlayers.length === 1) {
            this.endAuction()
        } else {
            this.getNextBid()
        }
    }

    async handleSinglePlayerAuction (player) {
        const bid = await this.ui.openAuctionModal({
            headerText: `Auction for ${this.auctionState.property.name}.`,
            bodyText: `Current bid is ${this.auctionState.highestBidder ? this.auctionState.highestBidder.name : ''} ${this.auctionState.highestBid}$ 
            ${player.name}   enter your bid: `,
            currentBid: this.auctionState.property.price
        })
        if (bid && bid >= this.auctionState.property.price) {
            this.auctionState.highestBid = bid
            this.auctionState.highestBidder = player
            this.auctionState.bids.set(player.id, bid)
        }
        this.endAuction()
    }

    endAuction () {
        if (this.auctionState.highestBidder) {
            this.banker.sellProperty(this.auctionState.highestBidder, this.auctionState.property)
            this.eventManager.notify('userInteraction', `${this.auctionState.highestBidder.name} won the auction for ${this.auctionState.property.name} with a bid of ${this.auctionState.highestBid}.`)
        } else {
            this.eventManager.notify('userInteraction', 'Auction ended property wasn\'t sold!')
        }
        this.endTurn()
    }

    async tryLuck (player) {
        let triesCount = 2 // +1 that user click on button
        let isFree = false
        while (triesCount > 0) {
            var rollResult = await new Promise((resolve) => {
                this.ui.animateRollDice((number, isDouble) => {
                    this.eventManager.notify('userInteraction', `Player ${player.name} rolled dice!`)
                    if (isDouble) {
                        this.eventManager.notify('userInteraction', `Player ${player.name} rolled doubles and is free!`)
                        resolve({ isFree: true, number })
                    } else {
                        resolve({ isFree: false })
                    }
                }, this.dice)
            })

            if (rollResult.isFree) {
                isFree = true
                break
            }

            triesCount--
        }

        if (isFree) {
            return rollResult.number
        } else {
            this.eventManager.notify('userInteraction', `Player ${player.name} stays in jail!`)
            return null
        }
    }

    async makeMove (position, { directMove, collectOnGO, shouldSwitch } = {
        directMove: false,
        collectOnGO: true,
        shouldSwitch: true
    }) {
        const player = this.getCurrentPlayer()

        const oldPosition = player.position
        if (!directMove) {
            this.eventManager.notify('userInteraction', `${position} on dice! Player ${player.name} starts moving!`)
        }

        await player.moveTo(position, directMove)

        if (player.position < oldPosition && collectOnGO) {
            this.banker.credit(player, 200)
            this.eventManager.notify('userInteraction', `${position} on dice. Player ${player.name} start moving`)
            this.updatePlayers()
        }

        const landedCell = this.board.getCellByPosition(player.position)
        this.eventManager.notify('userInteraction', `${player.name} landed at ${landedCell.name}`)

        if (landedCell.isCellPropertyForSell()) {
            if (Object.prototype.hasOwnProperty.call(landedCell, 'ownerId') && !landedCell.ownerId) {
                await this.handlePropertyBuy(landedCell)
            } else {
                this.banker.transfer(this.getPlayerById(player.id), this.getPlayerById(landedCell.ownerId), landedCell.rent)
                this.eventManager.notify('userInteraction', `Player ${player.name} pay rent to player ${this.getPlayerById(landedCell.ownerId).name}`)

                this.endTurn()
            }
        } else if (landedCell.isCellChance() || landedCell.isCellCommunityChest()) {
            const card = this.communityChestCards.drawCard()
            await this.ui.openCardModal({ headerText: 'Chance Card', card })
            await card.action(this, player)

            this.endTurn()
        } else if (landedCell.isCellTax()) {
            await this.ui.openCardModal({ headerText: 'Chance Card', card: { description: 'Pay tax: 200$' } })
            this.banker.debit(player, 200)

            this.endTurn()
        } else if (landedCell.isGoToJail()) {
            if (player.jailFreeCard) {
                if (landedCell.isGoToJail()) {
                    if (player.jailFreeCard) {
                        player.useJailFreeCard()
                        this.eventManager.notify('userInteraction', `${player.name} uses 'Get Out of Jail Free' card`)

                        this.endTurn()
                    } else {
                        await this.makeMove(10)
                        player.goToJail()
                        this.eventManager.notify('userInteraction', `${player.name}  goes to Jail`)

                        this.endTurn()
                    }
                }
            }
        } else if (landedCell.isJail()) {
            if (shouldSwitch) {
                this.endTurn()
            }
            return null
        } else {
            this.endTurn()
        }
    }

    async handlePropertyBuy (property) {
        const result = await this.ui.openModal({
            headerText: 'Buy Property',
            bodyText: `Do you want to buy ${property.name} for ${property.price}?`
        })

        if (result) {
            this.banker.sellProperty(this.getCurrentPlayer(), property)
            this.eventManager.notify('userInteraction', `${this.getCurrentPlayer().name}  bought ${property.name}`)
            this.endTurn()
        } else {
            this.eventManager.notify('userInteraction', `${this.getCurrentPlayer().name}  dont want to buy ${property.name}`)
            this.startAuction(property)
        }
    }

    async afterRoll (dice, isDouble) {
        const currentPlayer = this.getCurrentPlayer()

        if (currentPlayer.inJail) {
            if (isDouble) {
                await this.makeMove(dice, { directMove: false, collectOnGO: false, shouldSwitch: true })
            } else {
                const jailResult = await this.tryLuck(currentPlayer)
                if (jailResult !== null) {
                    await this.makeMove(jailResult, { directMove: false, collectOnGO: false, shouldSwitch: true })
                } else {
                    this.endTurn()
                }
            }
        } else {
            await this.makeMove(dice)
        }
    }

    subscribe (eventType, observer) {
        this.eventManager.subscribe(eventType, observer)
    }

    unsubscribe (eventType, observer) {
        this.eventManager.unsubscribe(eventType, observer)
    }
}
