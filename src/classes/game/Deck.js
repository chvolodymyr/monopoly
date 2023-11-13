export default class Deck {
    constructor (cards) {
        this.cards = this.shuffle(cards)
    }

    shuffle (array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]]
        }
        return array
    }

    drawCard () {
        const card = this.cards.shift()
        this.cards.push(card)
        return card
    }
}
