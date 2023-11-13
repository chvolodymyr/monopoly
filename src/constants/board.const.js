export const BOARD_ITEMS = {
    AIRPORT: 'airport',
    RAILWAY: 'railway',
    CITY: 'city',
    TAX: 'tax',
    COMMUNITY_CHEST: 'communityChest',
    CHANCE: 'chance',
    GO: 'go',
    JAIL: 'jail',
    GO_TO_JAIL: 'goToJail',
    FREE_PARKING: 'freeParking'
}

export const COMMUNITY_CHEST_CARDS = [
    {
        description: 'Advance to Go (Collect $200)',
        action: async (game, player) => {
            await game.makeMove(0, { directMove: true, collectOnGO: true, shouldSwitch: false })
            return new Promise((resolve) => {
                resolve()
            })
        }
    },
    {
        description: 'Bank pays you dividend of $50',
        action: (game, player) => {
            return new Promise(resolve => {
                game.banker.credit(player, 50) // Collect $50
                resolve()
            })
        }
    },
    {
        description: 'Pay poor tax of $15',
        action: (game, player) => {
            return new Promise(resolve => {
                game.banker.debit(player, 15)
                resolve()
            })
        }
    },
    {
        description: 'Your building loan matures—collect $150',
        action: (game, player) => {
            return new Promise(resolve => {
                game.banker.credit(player, 150)
                resolve()
            })
        }
    },
    {
        description: 'Get Out of Jail Free',
        action: (game, player) => {
            return new Promise(resolve => {
                player.jailFreeCard = true
                resolve()
            })
        }
    },
    {
        description: 'Go to Jail. Go directly to Jail, do not pass Go, do not collect $200',
        action: async (game, player) => {
            await game.makeMove(10, { directMove: true, collectOnGO: false, shouldSwitch: false })
            return new Promise(resolve => {
                player.inJail = true
                resolve()
            })
        }
    },
    {
        description: 'You have been elected Chairman of the Board—pay each player $50',
        action: (game, player) => {
            return new Promise(resolve => {
                game.players.forEach(p => {
                    if (p !== player) {
                        game.banker.transfer(player, p, 50)
                    }
                })
                resolve()
            })
        }
    },
    {
        description: 'Speeding fine $15',
        action: (game, player) => {
            return new Promise(resolve => {
                game.banker.debit(player, 15)
                resolve()
            })
        }
    },
    {
        description: 'Bank error in your favor—collect $200',
        action: (game, player) => {
            return new Promise(resolve => {
                game.banker.credit(player, 200) // Collect $200
                resolve()
            })
        }
    },
    {
        description: "Doctor's fees—pay $50",
        action: (game, player) => {
            return new Promise(resolve => {
                game.banker.debit(player, 50) // Pay $50
                resolve()
            })
        }
    },
    {
        description: 'From sale of stock you get $50',
        action: (game, player) => {
            return new Promise(resolve => {
                game.banker.credit(player, 50) // Collect $50
                resolve()
            })
        }
    },
    {
        description: 'Holiday Fund matures—receive $100',
        action: (game, player) => {
            return new Promise(resolve => {
                game.banker.credit(player, 100) // Collect $100
                resolve()
            })
        }
    }
]
