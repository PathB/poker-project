import Deck from "./deck.js"
import Player from "./player.js"

let player1, opponent, pot;

player1 = new Player(500, "chips-display")
opponent = new Player(500, "chips-display-opponent")



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
const opponentBetStack = document.getElementById("oppnent-current-bet")
const playerBetStack = document.getElementById("player-current-bet")
const potDisplay = document.getElementById("pot-display")

player1.updateChipsDisplay()
opponent.updateChipsDisplay()

async function startRound() {
    const deck = new Deck
    let board = []
    player1.hand = []
    opponent.hand = []
    deck.shuffle()

    player1.hand.push(deck.pop(), deck.pop())
    opponent.hand.push(deck.pop(), deck.pop())

    console.log(opponent.hand)
    console.log(player1.hand)

    let gameStage = "preflop"
    potDisplay.innerHTML = 0

    boardCardSlot1.innerHTML = ""
    boardCardSlot2.innerHTML = ""
    boardCardSlot3.innerHTML = ""
    boardCardSlot4.innerHTML = ""
    boardCardSlot5.innerHTML = ""
    opponentCardSlot1.innerHTML = ""
    opponentCardSlot2.innerHTML = ""
    playerCardSlot1.innerHTML = ""
    playerCardSlot2.innerHTML = ""

    playerCardSlot1.appendChild(player1.hand[0].getHTML())
    playerCardSlot2.appendChild(player1.hand[1].getHTML())
    opponentCardSlot1.appendChild(createOpponentHiddenCards("opponent-card-1"))
    opponentCardSlot2.appendChild(createOpponentHiddenCards("opponent-card-2"))

    let inRound = true
    while (inRound) {
        switch (gameStage) {
            case "preflop":
                let opponentBet = await opponentAction(opponent)
                let playerBet = await playerAction(player1)
                if (playerBet === "Fold") {
                    inRound = false
                    break
                }
                if (playerBet === opponentBet) {
                    gameStage = "flop"
                    playerBetStack.innerHTML = 0
                    opponentBetStack.innerHTML = 0
                    board.push(deck.pop(), deck.pop(), deck.pop())
                    boardCardSlot1.appendChild(board[0].getHTML())
                    boardCardSlot2.appendChild(board[1].getHTML())
                    boardCardSlot3.appendChild(board[2].getHTML())
                    console.log(board)
                }
            case "flop":
                opponentBet = await opponentAction(opponent)
                playerBet = await playerAction(player1)
                if (playerBet === "Fold") {
                    inRound = false
                    break
                }
                if (playerBet === opponentBet) {
                    gameStage = "turn"
                    playerBetStack.innerHTML = 0
                    opponentBetStack.innerHTML = 0
                    board.push(deck.pop())
                    boardCardSlot4.appendChild(board[3].getHTML())
                    console.log(board)
                }
            case "turn":
                opponentBet = await opponentAction(opponent)
                playerBet = await playerAction(player1)
                if (playerBet === "Fold") {
                    inRound = false
                    break
                }
                if (playerBet === opponentBet) {
                    gameStage = "river"
                    playerBetStack.innerHTML = 0
                    opponentBetStack.innerHTML = 0
                    board.push(deck.pop())
                    console.log(board)
                    boardCardSlot5.appendChild(board[4].getHTML())
                    console.log(board)
                }
            case "river":
                opponentBet = await opponentAction(opponent)
                playerBet = await playerAction(player1)
                if (playerBet === "Fold") {
                    inRound = false
                    break
                }
                if (playerBet === opponentBet) {
                    gameStage = "showdown"
                    playerBetStack.innerHTML = 0
                    opponentBetStack.innerHTML = 0
                }
            case "showdown":
                opponentCardSlot1.innerHTML = ""
                opponentCardSlot2.innerHTML = ""
                opponentCardSlot1.appendChild(opponent.hand[0].getHTML())
                opponentCardSlot2.appendChild(opponent.hand[1].getHTML())
                console.log("we got here")
                inRound = false
                document.getElementById("dealButton").style.visibility = "visible"
                const playerHand = evaluateHand(player1, board)
                const opponentHand = evaluateHand(opponent, board)
                const pot = parseInt(potDisplay.innerText)
                if (HAND_RANKINGS.indexOf(playerHand) > HAND_RANKINGS.indexOf(opponentHand)) {
                    alert(`You win ${pot} $ with ${playerHand} !`)
                    player1.addChips(pot)
                } else if (HAND_RANKINGS.indexOf(playerHand) < HAND_RANKINGS.indexOf(opponentHand)) {
                    alert(`You lose, opponent wins with ${opponentHand} !`)
                    opponent.addChips(pot)
                } else {
                    alert(`Draw, players split the pot of ${pot} $`)
                    player1.addChips(Math.floor(pot / 2))
                    opponent.addChips(Math.floor(pot / 2))
                }
                break
        }
    }
}

function evaluateHand(player, board) {
    const fullHand = player.hand.concat(board)

    console.log(fullHand)

    if (isStraightFlush(fullHand))
        return "straight-flush"
    else if (isFourOfAKind(fullHand))
        return "four-of-a-kind"
    else if (isFullHouse(fullHand))
        return "full-house"
    else if (isFlush(fullHand))
        return "flush"
    else if (isStraight(fullHand))
        return "straight"
    else if (isSet(fullHand))
        return "three-of-a-kind"
    else if (isTwoPair(fullHand))
        return "two-pair"
    else if (isPair(fullHand))
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
    function isStraightFlush(hand) {
        sortBySuit(hand)
        for (let i = 0; i < hand.length - 4; i++) {
            if (hand[i].suit === hand[hand.length - 1].suit) {
                let suitedCards = hand.slice(i, hand.length)
                return isStraight(suitedCards)
            } else if (hand[i].suit === hand[hand.length - 2].suit && (hand.length - 2) - i >= 5) {
                let suitedCards = hand.slice(i, hand.length - 1)
                return isStraight(suitedCards)
            } else if (hand[i].suit === hand[hand.length - 3].suit && (hand.length - 3) - i >= 5) {
                let suitedCards = hand.slice(i, hand.length - 2)
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

    function isSet(hand) {
        sortByValue(hand)
        for (let i = 0; i < hand.length - 2; i++) {
            if (hand[i].value === hand[i + 2].value) {
                return true
            }
        }
        return false
    }

    function isTwoPair(hand) {
        sortByValue(hand)
        for (let i = 0; i < hand.length - 1; i++) {
            if (hand[i].value === hand[i + 1].value) {
                let restOfHand = hand.slice(i + 2, hand.length)
                return isPair(restOfHand)
            }
        }
        return false
    }

    function isPair(hand) {
        sortByValue(hand)
        for (let i = 0; i < hand.length - 1; i++) {
            if (hand[i].value === hand[i + 1].value) {
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


async function opponentAction(opponent) {
    return new Promise((resolve) => {
        const random = 8 //Math.floor(Math.random() * 10)
        console.log(random)
        let potDisplay = document.getElementById("pot-display")
        const playerBet = parseInt(playerBetStack.innerHTML)
        const currentBet = parseInt(opponentBetStack.innerHTML)
        const toCall = playerBet - currentBet
        if (random < 3) { //fold
            alert("Opponent folded, you win!")
        } else if (2 < random && random < 8) { //check-call
            if (opponent.chips >= largestBet) {
                opponentBetStack.innerHTML = `${largestBet}`
                opponent.removeChips(betIncrease)
                pot = parseInt(potDisplay.innerText) + betIncrease
                potDisplay.innerText = pot
                console.log("Opponent calls")
                return largestBet
            } else {
                const call = opponent.chips + currentBet
                opponent.removeChips(opponent.chips)
                opponentBetStack.innerHTML = `${call}`
                pot = parseInt(potDisplay.innerText) + call
                potDisplay.innerText = pot
                console.log("Opponent calls and is all in")
                return largestBet
            }
        } else { //raise
            //const raise = Math.floor(Math.random() * (opponent.chips - toCall + 1)) + toCall
            let raise = 20 + (playerBet * 2)
            if (raise >= opponent.chips) {
                console.log("Opponent is ALL IN!")
                raise = opponent.chips
            }
            const newBet = currentBet + raise
            opponentBetStack.innerHTML = `${newBet}`
            opponent.removeChips(raise)
            potDisplay.innerText = parseInt(potDisplay.innerText) + raise
            console.log(`Opponent raises to ${newBet}`)
            resolve(newBet)

        }
    })


}

function createOpponentHiddenCards(cardId) {
    const cardDiv = document.createElement("div")
    cardDiv.classList.add("card", "back")
    cardDiv.id = cardId
    return cardDiv
}

function updateCheckButtonText() {
    const opponentBet = parseInt(opponentBetStack.innerHTML)
    const checkButton = document.getElementById("checkButton")

    if (opponentBet === 0) {
        checkButton.innerText = "Check"
    } else {
        checkButton.innerText = "Call"
    }
}

const observer = new MutationObserver(updateCheckButtonText);
observer.observe(opponentBetStack, { childList: true })

document.getElementById("betSlider").addEventListener("input", function (event) {
    let sliderValue = event.target.value;
    document.getElementById("betSlider").max = player1.chips
    document.getElementById("userInput").value = sliderValue

})

document.getElementById("dealButton").addEventListener("click", () => {
    document.getElementById("dealButton").style.visibility = "hidden"
    startRound()
})
// TODO: fix bug where player bets double the amount on a raise
// TODO: resolve opponent is all in/ player is all in
function playerAction(player) {
    return new Promise((resolve) => {
        const handleBet = () => { //bet
            const input = parseInt(document.getElementById("userInput").value)
            const opponentBet = parseInt(opponentBetStack.innerHTML)
            const playerCurrentBet = parseInt(playerBetStack.innerHTML)
            const toCall = opponentBet - playerCurrentBet

            if (input < toCall || input < 0 || input > player.chips || isNaN(input)) {
                alert("Invalid input! Please enter a valid bet amount.")
                document.getElementById("betButton").addEventListener("click", handleBet, { once: true })
            } else {
                console.log("Bet amount: " + input)
                player.removeChips(input)
                console.log("current bet is:" + playerCurrentBet)
                let newBet = playerCurrentBet + input
                playerBetStack.innerHTML = `${newBet}`
                potDisplay.innerText = parseInt(potDisplay.innerText) + input
                resolve(newBet)
            }
        }

        const handleCheck = () => { //check or call
            const opponentBet = parseInt(opponentBetStack.innerHTML)
            const playerCurrentBet = parseInt(playerBetStack.innerHTML)
            const toCall = opponentBet - playerCurrentBet

            if (toCall > player.chips) {
                alert("You don't have enough chips to match the opponent's bet.")
            } else {
                player.removeChips(toCall)
                let newBet = playerCurrentBet + toCall
                playerBetStack.innerHTML = `${newBet}`
                potDisplay.innerText = parseInt(potDisplay.innerText) + toCall
                console.log("Matched opponent's bet: " + newBet)
                resolve(newBet)
            }
        }

        const handleFold = () => {
            const pot = parseInt(potDisplay.innerHTML)
            opponentCardSlot1.innerHTML = ""
            opponentCardSlot2.innerHTML = ""
            boardCardSlot1.innerHTML = ""
            boardCardSlot2.innerHTML = ""
            boardCardSlot3.innerHTML = ""
            boardCardSlot4.innerHTML = ""
            boardCardSlot5.innerHTML = ""
            opponent.addChips(pot)
            opponentBetStack.innerHTML = 0
            playerBetStack.innerHTML = 0
            playerCardSlot1.innerHTML = ""
            playerCardSlot2.innerHTML = ""
            potDisplay.innerHTML = 0
            document.getElementById("dealButton").style.visibility = "visible"
            resolve("Fold")

        }

        document.getElementById("betButton").addEventListener("click", handleBet, { once: true })
        document.getElementById("checkButton").addEventListener("click", handleCheck, { once: true })
        document.getElementById("foldButton").addEventListener("click", handleFold, { once: true })
    })
}

