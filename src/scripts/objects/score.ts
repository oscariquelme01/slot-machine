const initial_balance = '100000'

export default class Score extends Phaser.GameObjects.Text {
    constructor(scene: Phaser.Scene, x: number, y: number){
        super(scene, x, y, initial_balance, {fontFamily: 'neon'})
        this.setFontSize(64).setWordWrapWidth(300)

        scene.add.existing(this)
    }

    add(quantity: number){
        var balance = parseInt(this.text)

        balance += quantity

        this.setText(balance.toString())
    }

    substract(quantity: number){
        var balance = parseInt(this.text)

        balance -= quantity

        if(balance < 0){
            balance += quantity
            return false
        }

        this.setText(balance.toString())
        
        return true
    }


}
