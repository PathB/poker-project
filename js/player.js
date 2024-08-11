
export default class Player {
    constructor(chips, chipDisplayId){
        this.hand = []
        this.chips = chips
        this.chipDisplayId = chipDisplayId
    }
    addChips(amount){
        this.chips += amount
    }
    removeChips(amount){
        this.chips -= amount
    }
    updateChipsDisplay() {
        document.getElementById(this.chipDisplayId).innerText = `${this.chips} $`
    }

}