export class Dice {
    instance

    createInstance () {
        const die1 = () => Math.floor(Math.random() * 6) + 1
        const die2 = () => Math.floor(Math.random() * 6) + 1

        return { die1, die2 }
    }

    getInstance () {
        if (!this.instance) this.instance = this.createInstance()
        return this.instance
    }
}
