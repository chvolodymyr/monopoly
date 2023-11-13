import { boardFactory } from '../factories/board.factory.js'
import { BOARD_ITEMS } from '../../constants/board.const.js'
import { COLORS } from '../../constants/city-colors.js'

export class Board {
    constructor (id, dom, ui) {
        this.dom = dom
        this.element = this.dom.getElement(`#${id}`) || {}
        this.ui = ui
        this.boardData = null
    }

    generate () {
        this.boardData = this.createInitialBoardLayout()
        for (const partName in this.boardData) {
            const boardPart = new BoardPart(this.boardData[partName], partName, this.dom, this.ui)
            const boardPartElement = boardPart.createBoardPartElement()
            this.element.appendChild(boardPartElement)
        }
    }

    createInitialBoardLayout () {
        return {
            bottom: [boardFactory.generateBoardItem(BOARD_ITEMS.GO, 'Go'), boardFactory.generateBoardItem(BOARD_ITEMS.CITY, 'Uzhgorod', 60, 2, COLORS.BROWN), boardFactory.generateBoardItem(BOARD_ITEMS.COMMUNITY_CHEST), boardFactory.generateBoardItem(BOARD_ITEMS.CITY, 'Ivano-Frankivsk', 60, 4, COLORS.BROWN), boardFactory.generateBoardItem(BOARD_ITEMS.TAX), boardFactory.generateBoardItem(BOARD_ITEMS.RAILWAY, 'KYIV Railroad', 200, 25), boardFactory.generateBoardItem(BOARD_ITEMS.CITY, 'Chernivtsi', 100, 6, COLORS.LIGHT_BLUE), boardFactory.generateBoardItem(BOARD_ITEMS.CHANCE), boardFactory.generateBoardItem(BOARD_ITEMS.CITY, 'Sumy', 100, 6, COLORS.LIGHT_BLUE), boardFactory.generateBoardItem(BOARD_ITEMS.CITY, 'Zhytomyr', 120, 8, COLORS.LIGHT_BLUE)],
            left: [boardFactory.generateBoardItem(BOARD_ITEMS.JAIL), boardFactory.generateBoardItem(BOARD_ITEMS.CITY, 'Poltava', 140, 10, COLORS.PINK), boardFactory.generateBoardItem(BOARD_ITEMS.AIRPORT, 'LVIV', 200, 4), boardFactory.generateBoardItem(BOARD_ITEMS.CITY, 'Cherkasy', 140, 10, COLORS.PINK), boardFactory.generateBoardItem(BOARD_ITEMS.CITY, 'Rivne', 160, 12, COLORS.PINK), boardFactory.generateBoardItem(BOARD_ITEMS.RAILWAY, 'Kharkiv Railroad', 200, 25), boardFactory.generateBoardItem(BOARD_ITEMS.CITY, 'Lutsk', 180, 14, COLORS.ORANGE), boardFactory.generateBoardItem(BOARD_ITEMS.COMMUNITY_CHEST), boardFactory.generateBoardItem(BOARD_ITEMS.CITY, 'Mykolaiv', 180, 14, COLORS.ORANGE), boardFactory.generateBoardItem(BOARD_ITEMS.CITY, 'Khmelnytskyi', 200, 16, COLORS.ORANGE)],
            top: [boardFactory.generateBoardItem(BOARD_ITEMS.FREE_PARKING), boardFactory.generateBoardItem(BOARD_ITEMS.CITY, 'Dnipro', 220, 18, COLORS.RED), boardFactory.generateBoardItem(BOARD_ITEMS.CHANCE), boardFactory.generateBoardItem(BOARD_ITEMS.CITY, 'Kharkiv', 220, 18, COLORS.RED), boardFactory.generateBoardItem(BOARD_ITEMS.CITY, 'Odessa', 240, 20, COLORS.RED), boardFactory.generateBoardItem(BOARD_ITEMS.RAILWAY, 'Odessa Railroad', 200, 25), boardFactory.generateBoardItem(BOARD_ITEMS.CITY, 'Zaporizhzhia', 260, 22, COLORS.YELLOW), boardFactory.generateBoardItem(BOARD_ITEMS.CITY, 'Kryvyi Rih', 260, 22, COLORS.YELLOW), boardFactory.generateBoardItem(BOARD_ITEMS.AIRPORT, 'KYIV ', 200, 4), boardFactory.generateBoardItem(BOARD_ITEMS.CITY, 'Mariupol', 280, 24, COLORS.YELLOW)],
            right: [boardFactory.generateBoardItem(BOARD_ITEMS.GO_TO_JAIL), boardFactory.generateBoardItem(BOARD_ITEMS.CITY, 'Lviv', 300, 26, COLORS.GREEN), boardFactory.generateBoardItem(BOARD_ITEMS.CITY, 'Vinnitsa', 300, 26, COLORS.GREEN), boardFactory.generateBoardItem(BOARD_ITEMS.COMMUNITY_CHEST), boardFactory.generateBoardItem(BOARD_ITEMS.CITY, 'Chernihiv', 320, 28, COLORS.GREEN), boardFactory.generateBoardItem(BOARD_ITEMS.RAILWAY, 'Sevastopol Railroad', 200, 25), boardFactory.generateBoardItem(BOARD_ITEMS.CHANCE), boardFactory.generateBoardItem(BOARD_ITEMS.CITY, 'Kyiv', 350, 35, COLORS.DARK_BLUE), boardFactory.generateBoardItem(BOARD_ITEMS.TAX), boardFactory.generateBoardItem(BOARD_ITEMS.CITY, 'Sevastopol', 400, 50, COLORS.DARK_BLUE)]
        }
    }

    getCellByPosition (position) {
        if (!this.flattenedBoardData) {
            this.flattenedBoardData = [].concat(...Object.values(this.boardData))
        }
        return this.flattenedBoardData[position]
    }
}

class BoardPart {
    constructor (boardPartData, partName, dom, ui) {
        this.boardPartData = boardPartData
        this.partName = partName
        this.dom = dom
        this.ui = ui
    }

    createBoardPartElement () {
        const boardPartElement = this.dom.createElement('div', { className: this.partName })
        for (const item of this.boardPartData) {
            const boardItem = new BoardItem(item, this.partName, this.dom, this.ui)
            const boardItemElement = boardItem.createElement()
            boardPartElement.appendChild(boardItemElement)
        }
        return boardPartElement
    }
}

class BoardItem {
    constructor (item, boardPart, dom, ui) {
        this.boardPart = boardPart
        this.item = item
        this.dom = dom
        this.ui = ui
    }

    createElement () {
        const boardItemElement = this.dom.createElement('div',
            {
                className: 'cell', id: this.item.elementId
            },
            {
                tippyContent: this.item.price
                    ? `<p>${this.item.name}</p><br><p><b>Price: </b>${this.item.price} <br> <p><b>Rent: </b>${this.item.rent}</p>`
                    : `<p>${this.item.name}</p>`
            })

        const boardItemElementContent = this.dom.createElement('div')

        if (this.item.type === BOARD_ITEMS.CITY) {
            const boardItemElementColor = this.ui.createColorElement(this.item)

            boardItemElementContent.appendChild(boardItemElementColor)
        }
        this.ui.setStylesForBoardElementContent(boardItemElementContent, this.item)
        this.ui.setStylesForBoardElement(boardItemElement, this.item)

        boardItemElement.appendChild(boardItemElementContent)
        return boardItemElement
    }
}
