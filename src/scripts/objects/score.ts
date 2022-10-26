export default class Score extends Phaser.GameObjects.Text {

    constructor(scene: Phaser.Scene, x: number, y: number, balance: string){
        super(scene, x, y, balance, {fontFamily: 'neon'})
        this.setFontSize(64).setWordWrapWidth(300)

        scene.add.existing(this)
    }

    add(quantity: number){
        var balance = parseInt(this.text)

        balance += quantity

        var text = this.scene.add.text(this.x, this.y, '+' + quantity.toString(), {fontFamily: 'neon', color: '#0eed02'})
        text.setFontSize(64)
        this.scene.tweens.add({y: this.y - 100,targets: text, duration: 2000, onComplete: this.destroy_text})

        this.setText(balance.toString())
    }

    substract(quantity: number){
        var balance = parseInt(this.text)

        balance -= quantity

        if(balance < 0){
            balance += quantity
            return false
        }


        var text = this.scene.add.text(this.x, this.y, '-' + quantity.toString(), {fontFamily: 'neon', color: '#d11406'})
        text.setFontSize(64)
        this.scene.tweens.add({y: this.y + 50,targets: text, duration: 1000, onComplete: this.destroy_text})
        
        this.setText(balance.toString())
        
        
        return true
    }

    // function clean up to call on complete 
    private destroy_text(tween: Phaser.Tweens.Tween, text: Phaser.GameObjects.Text[]){

        // [0] because there is only one target but the argument text is an array
        text[0].destroy()
        tween.remove()
    }


}
