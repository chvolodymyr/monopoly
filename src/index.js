import tippy from 'tippy.js'
import 'tippy.js/dist/tippy.css'
import { Board } from './classes/game/Board.js'
import Player from './classes/game/Player.js'
import Game from './classes/game/Game.js'
import LoggerObserver from './classes/observer/LoggerObserver.js'
import DependencyInjector from './classes/DependencyInjector.js'
import UIManager from './classes/ui/UIManager.js'
import Banker from './classes/game/Banker.js'
import Deck from './classes/game/Deck.js'
import { Dice } from './classes/game/Dice.js'
import DOM from './classes/ui/DOM.js'
import EventManager from './classes/observer/EventManager.js'
import { COMMUNITY_CHEST_CARDS } from './constants/board.const.js'
import { generateRandomColor } from './helpers/helpers.js'

const injector = registerDependency()
const game = initGame()
registerEventListeners()

tippy('[data-tippy-content]', {
    allowHTML: true
})

function registerDependency () {
    const injector = new DependencyInjector()

    injector.register('dom', new DOM())
    injector.register('ui', new UIManager(injector.get('dom')))
    injector.register('board', new Board('board', injector.get('dom'), injector.get('ui')))

    injector.register('banker', new Banker())
    injector.register('deckCommunity', new Deck(COMMUNITY_CHEST_CARDS))
    injector.register('deckChance', new Deck(COMMUNITY_CHEST_CARDS))
    injector.register('dice', new Dice())
    injector.register('logger', new LoggerObserver())
    injector.register('eventManager', new EventManager())

    return injector
}

function registerEventListeners () {
    injector.get('dom').getElement('#startGame').addEventListener('click', () => {
        startGame()
    })
    injector.get('dom').getElement('#endGame').addEventListener('click', () => {
        endGame()
    })
    injector.get('dom').addEventListener(document, 'DOMContentLoaded', () => {
        injector.get('ui').showScreen(game.status)
    })

    injector.get('dom').getElement('dice').addEventListener('click', injector.get('ui').animateRollDice.bind(injector.get('ui'), game.afterRoll, game.dice))
    injector.get('dom').addEventListener(document, 'movementComplete', function () {
        injector.get('dom').getElement('#dice').disabled = false
    })

    injector.get('dom').getElement('playerForm').addEventListener('submit', function (event) {
        event.preventDefault()

        const playerNameEl = injector.get('dom').getElement('#playerName')
        const playerName = playerNameEl.value
        const playerColorEl = injector.get('dom').getElement('#playerColor')
        const playerColor = playerColorEl.value
        const newPlayer = new Player(playerName, 'player' + game.players.length + 1, playerColor, injector.get('ui'))
        game.addPlayer(newPlayer)
        if (game.players.length === 4) {
            game.startGame()
        }
        playerNameEl.value = ''
        playerColorEl.value = generateRandomColor()
    })
}

function initGame () {
    const game = new Game(injector.get('board'),
        injector.get('ui'),
        injector.get('banker'),
        injector.get('eventManager'),
        injector.get('deckCommunity'),
        injector.get('deckChance'),
        injector.get('dice'))

    game.subscribe('userInteraction', injector.get('logger'))

    injector.get('board').generate()

    return game
}

function startGame () {
    game.startGame()
}

function endGame () {
    game.endGame()
}
