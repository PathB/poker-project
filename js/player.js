
export default class Player {
    constructor(chips){
        this.hand = []
        this.chips = chips
    }
    addChips(amount){
        this.chips += amount
    }
    removeChips(amount){
        this.chips -= amount
    }
    updateChipsDisplay() {
        document.getElementById("chips-display").innerText = `Funds: ${this.chips}`
    }

}