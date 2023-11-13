export default class Banker {
    credit (player, amount) {
        player.money += amount
    }

    debit (player, amount) {
        if (player.money < amount) {
            return
        }
        player.money -= amount
    }

    transfer (fromPlayer, toPlayer, amount) {
        this.debit(fromPlayer, amount)
        this.credit(toPlayer, amount)
    }

    sellProperty (player, property) {
        this.debit(player, property.price)
        property.setOwner(player)
    }
}
