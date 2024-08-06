import Deck from "./deck.js"
import Player from "./player.js"

const HAND_RANKINGS = [
    "high-card",
    "pair",
    "two-pair",
    "three-of-a-kind",
    "straight",
    "flush",
    "full-house",
    "four-of-a-kind",
    "straight-flush"
]
const CARD_VALUE_MAP = {
    "2": 2,
    "3": 3,
    "4": 4,
    "5": 5,
    "6": 6,
    "7": 7,
    "8": 8,
    "9": 9,
    "10": 10,
    "J": 11,
    "Q": 12,
    "K": 13,
    "A": 14
}
const playerCardSlot1 = document.querySelector(".player-card-slot-1")
const playerCardSlot2 = document.querySelector(".player-card-slot-2")
const boardCardSlot1 = document.querySelector(".board-card-slot-1")
const boardCardSlot2 = document.querySelector(".board-card-slot-2")
const boardCardSlot3 = document.querySelector(".board-card-slot-3")
const boardCardSlot4 = document.querySelector(".board-card-slot-4")
const boardCardSlot5 = document.querySelector(".board-card-slot-5")
startRound()

function startRound() {
    const deck = new Deck
    let board = []
    deck.shuffle()
    const player1 = new Player
    player1.hand.push(deck.pop(), deck.pop())
    board.push(deck.pop(), deck.pop(), deck.pop(), deck.pop(), deck.pop())

    let gameStage = "preflop"

    playerCardSlot1.appendChild(player1.hand[0].getHTML())
    playerCardSlot2.appendChild(player1.hand[1].getHTML())
    boardCardSlot1.appendChild(board[0].getHTML())
    boardCardSlot2.appendChild(board[1].getHTML())
    boardCardSlot3.appendChild(board[2].getHTML())
    boardCardSlot4.appendChild(board[3].getHTML())
    boardCardSlot5.appendChild(board[4].getHTML())

    console.log(board)
    console.log(deck)
    console.log(player1.hand)

    console.log(evaluateHand(player1, board))
}

function evaluateHand(player, board) {
    const fullHand = player.hand.concat(board)
    
    isFlush(fullHand)
    isStraight(fullHand)
    isFourOfAKind(fullHand)
    isFullHouse(fullHand)
    isASet(fullHand)
    isTwoPair(fullHand)
    isPair(fullHand)

}


