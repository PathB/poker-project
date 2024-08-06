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

    // if (isFlush(fullHand) && isStraight(fullHand))
    //     return "straight-flush"
    // else if(isFourOfAKind(fullHand))
    //     return "four-of-a-kind"
    // else if(isFullHouse(fullHand))
    //     return "full-house"
    // else if(isFlush(fullHand))
    //     return "flush"
    // else if(isStraight(fullHand))
    //     return "straight"
    // else if(isSet(fullHand))
    //     return "three-of-a-kind"
    // else if(isTwoPair(fullHand))
    //     return "two-pair"
    // else if(isPair(fullHand))
    //     return "pair"
    // else
    //     return "high-card"
    // if (isFlush(fullHand))
    //     return "flush"
    if(isFlush(fullHand))
        return "flush"
    else if(isStraight(fullHand))
        return "straight"
    else
        return "nothing"

    function isFlush(fullHand) {
        let flush = false
        sortBySuit(fullHand)
        for (let i = 0; i < 3; i++) {
            if (fullHand[i].suit === fullHand[i + 4].suit && flush === false) {
                flush = true
            }
        }
        return flush
    }
    function isStraight(fullHand) {
        sortByValue(fullHand)
        for (let i = 0; i < 3; i++) {
            let valueHand = fullHand.slice(i, i+5)
            if (valueHand[4].value === "A") {
                let test1 =
                    valueHand[0].value === "2" &&
                    valueHand[1].value === "3" &&
                    valueHand[2].value === "4" &&
                    valueHand[3].value === "5"
                let test2 =
                    valueHand[0].value === "10" &&
                    valueHand[1].value === "J" &&
                    valueHand[2].value === "Q" &&
                    valueHand[3].value === "K"
                if(test1 || test2){
                    return true
                }else{
                    continue
                }

            } else {
                let compareValue = CARD_VALUE_MAP[valueHand[0].value] + 1
                let count = 0
                for (let j = 1; j < 5; j++) {
                    if (CARD_VALUE_MAP[valueHand[j].value] == compareValue) {
                        compareValue++
                        count++
                        if(count == 4)
                            return true
                    }                  
                }
            }
        }
        return false
    }

    function sortBySuit(fullHand) {
        let smallest
        for (let i = 0; i < fullHand.length; i++) {
            smallest = i
            for (let j = i + 1; j < fullHand.length; j++) {
                if (fullHand[j].suit < fullHand[smallest].suit) {
                    smallest = j
                }
            }
            let temp = fullHand[i]
            fullHand[i] = fullHand[smallest]
            fullHand[smallest] = temp
        }
    }
    function sortByValue(fullHand) {
        let smallest
        for (let i = 0; i < fullHand.length; i++) {
            smallest = i
            for (let j = i + 1; j < fullHand.length; j++) {
                if (CARD_VALUE_MAP[fullHand[j].value] < CARD_VALUE_MAP[fullHand[smallest].value]) {
                    smallest = j
                }
            }
            let temp = fullHand[i]
            fullHand[i] = fullHand[smallest]
            fullHand[smallest] = temp
        }
    }
    // function isFourOfAKind(fullHand)
    // function isFullHouse(fullHand)
    // function isSet(fullHand)
    // function isTwoPair(fullHand)
    // function isPair(fullHand)



}
