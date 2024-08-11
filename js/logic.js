import Deck from "./deck.js"
import Player from "./player.js"

let player1, opponent, pot, largestBet;

player1 = new Player(500, "chips-display")
opponent = new Player(500, "chips-display-opponent")

document.getElementById("betSlider").addEventListener("input", function() {
    var sliderValue = this.value;
    document.getElementById("betSlider").max = player1.chips
    document.getElementById("userInput").value = sliderValue

});

document.getElementById("betButton").addEventListener("click", function() {
    var input = Math.abs(document.getElementById("userInput").value)
    if (player1.chips >= input > 0){
        console.log("Bet amount: " + input);
        player1.removeChips(input)
        player1.updateChipsDisplay()
        let potDisplay = document.getElementById("pot-display")
        pot = parseInt(potDisplay.innerText) + input
        potDisplay.innerText = pot

        if(largestBet < input){
            largestBet = input
        }
    }else{
        alert("Invalid input")
    }
    
});

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
const opponentCardSlot1 = document.querySelector(".opponent-card-slot-1")
const opponentCardSlot2 = document.querySelector(".opponent-card-slot-2")
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
    player1.updateChipsDisplay()
    player1.hand.push(deck.pop(), deck.pop())
    opponent.hand.push(deck.pop(), deck.pop())
    board.push(deck.pop(), deck.pop(), deck.pop(), deck.pop(), deck.pop())

    let gameStage = "preflop"
    pot = 0
    largestBet = 0

    playerCardSlot1.appendChild(player1.hand[0].getHTML())
    playerCardSlot2.appendChild(player1.hand[1].getHTML())
    

    // opponentCardSlot1.innerHTML = ""
    // opponentCardSlot2.innerHTML = ""
    // opponentCardSlot1.appendChild(opponent.hand[0].getHTML())
    // opponentCardSlot2.appendChild(opponent.hand[1].getHTML())
   

    boardCardSlot1.appendChild(board[0].getHTML())
    boardCardSlot2.appendChild(board[1].getHTML())
    boardCardSlot3.appendChild(board[2].getHTML())
    boardCardSlot4.appendChild(board[3].getHTML())
    boardCardSlot5.appendChild(board[4].getHTML())

    opponent.updateChipsDisplay()

    console.log(board)
    console.log(deck)
    console.log(player1.hand)
    console.log(evaluateHand(player1, board))
}

function evaluateHand(player, board) {
    const fullHand = player.hand.concat(board)
 
    console.log(fullHand)

    if (isStraightFlush(fullHand))
        return "straight-flush"
    else if (isFourOfAKind(fullHand))
        return "four-of-a-kind"
    else if(isFullHouse(fullHand))
        return "full-house"
    else if (isFlush(fullHand))
        return "flush"
    else if (isStraight(fullHand))
        return "straight"
     else if(isSet(fullHand))
         return "three-of-a-kind"
    else if(isTwoPair(fullHand))
        return "two-pair"
    else if(isPair(fullHand))
        return "pair"
    else
        return "high-card"



    function isFlush(hand) {
        sortBySuit(hand)
        for (let i = 0; i < hand.length - 4; i++) {
            if (hand[i].suit === hand[i + 4].suit) {
                return true
            }
        }
        return false
    }
    function isStraight(hand) {
        sortByValue(hand)
        for (let i = 0; i < hand.length - 4; i++) {
            let valueHand = hand.slice(i, i + 5)
            if (valueHand[4].value === "A") {
                let case1 =
                    valueHand[0].value === "2" &&
                    valueHand[1].value === "3" &&
                    valueHand[2].value === "4" &&
                    valueHand[3].value === "5"
                let case2 =
                    valueHand[0].value === "10" &&
                    valueHand[1].value === "J" &&
                    valueHand[2].value === "Q" &&
                    valueHand[3].value === "K"
                if (case1 || case2) {
                    return true
                }
            } else {
                let compareValue = CARD_VALUE_MAP[valueHand[0].value] + 1
                let count = 0
                for (let j = 1; j < 5; j++) {
                    if (CARD_VALUE_MAP[valueHand[j].value] == compareValue) {
                        compareValue++
                        count++
                        if (count == 4) return true
                    }
                }
            }
        }
        return false
    }
    function isStraightFlush(hand){
        sortBySuit(hand)
        for(let i = 0; i < hand.length - 4; i++){
            if (hand[i].suit === hand[hand.length-1].suit){
                let suitedCards = hand.slice(i, hand.length)
                return isStraight(suitedCards)
            }else if(hand[i].suit === hand[hand.length-2].suit && (hand.length-2)-i >= 5){
                let suitedCards = hand.slice(i, hand.length-1)
                return isStraight(suitedCards)
            }else if(hand[i].suit === hand[hand.length-3].suit && (hand.length-3)-i >= 5){
                let suitedCards = hand.slice(i, hand.length-2)
                return isStraight(suitedCards)
            }
        }
        return false
    }
    function isFourOfAKind(hand) {
        sortByValue(hand)
        for (let i = 0; i < hand.length - 3; i++) {
            if (hand[i].value === hand[i + 1].value &&
                hand[i + 1].value === hand[i + 2].value &&
                hand[i + 2].value === hand[i + 3].value) {
                return true
            }
        }
        return false
    }
    function isFullHouse(hand) {
        sortByValue(hand)
        for (let i = 0; i < hand.length - 4; i++) {
            let case1 =
                hand[i].value === hand[i + 1].value &&
                hand[i + 1].value === hand[i + 2].value &&
                hand[i + 3].value === hand[i + 4].value
            let case2 =
                hand[i].value === hand[i + 1].value &&
                hand[i + 2].value === hand[i + 3].value &&
                hand[i + 3].value === hand[i + 4].value
            if (case1 || case2) {
                return true
            }
        }
        return false
    }

    function isSet(hand){
        sortByValue(hand)
        for(let i = 0; i < hand.length - 2; i++){
            if(hand[i].value === hand[i+2].value){
                return true
            }
        }
        return false
    }

    function isTwoPair(hand){
        sortByValue(hand)
        for(let i = 0; i < hand.length - 1; i++){
            if(hand[i].value === hand[i+1].value){
                let restOfHand = hand.slice(i+2 , hand.length)
                return isPair(restOfHand)
            }
        }
        return false
    }

    function isPair(hand){
        sortByValue(hand)
        for(let i = 0; i < hand.length - 1; i++){
            if(hand[i].value === hand[i+1].value){
                return true
            }
        }
        return false
    }

    function sortBySuit(hand) {
        let smallest
        for (let i = 0; i < hand.length; i++) {
            smallest = i
            for (let j = i + 1; j < hand.length; j++) {
                if (hand[j].suit < hand[smallest].suit) {
                    smallest = j
                }
            }
            let temp = hand[i]
            hand[i] = hand[smallest]
            hand[smallest] = temp
        }
    }
    function sortByValue(hand) {
        let smallest
        for (let i = 0; i < hand.length; i++) {
            smallest = i
            for (let j = i + 1; j < hand.length; j++) {
                if (CARD_VALUE_MAP[hand[j].value] < CARD_VALUE_MAP[hand[smallest].value]) {
                    smallest = j
                }
            }
            let temp = hand[i]
            hand[i] = hand[smallest]
            hand[smallest] = temp
        }
    }
}

function opponentBet(opponent, largestBet){
    const random = Math.random() * 10
    // TODO
}
