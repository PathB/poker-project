const SUITS = ["♣", "♦", "♥", "♠"]
const VALUES = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"]

export default class Deck {
    constructor(cards = newDeck()) {
        this.cards = cards
    }

    get numberOfCards() {
        return this.cards.length
    }

    pop(){
        return this.cards.shift()
    }

    shuffle() {
        for (let i = this.numberOfCards - 1; i > 0; i--) {
            const randomIndex = Math.floor(Math.random() * i)
            const cardAtRandomIndex = this.cards[randomIndex]
            this.cards[randomIndex] = this.cards[i]
            this.cards[i] = cardAtRandomIndex
        }
    }
}
class Card {
    constructor(suit, value) {
        this.suit = suit
        this.value = value
    }
    get color(){
        return this.suit === "♠" || this.suit === "♣" ? "black" : "red"
    }

    getHTML(){
        const cardDiv = document.createElement('div')
        cardDiv.innerText = this.suit
        cardDiv.classList.add("card", this.color)
        cardDiv.dataset.value = `${this.value} ${this.suit}`
        return cardDiv
    }
}

function newDeck() {
    return SUITS.flatMap(suit => {
        return VALUES.flatMap(value => {
            return new Card(suit, value)
        })
    })
}