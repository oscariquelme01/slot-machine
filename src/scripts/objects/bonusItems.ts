import BonusScene, { postDict } from "../scenes/bonus"

export const BONUS_IMAGE_SIDE = 190

export default class BonusItem extends Phaser.GameObjects.Container {
    open: boolean

    constructor(scene: BonusScene, x: number, y: number) {
        super(scene, x, y)
        scene.add.existing(this)

        this.open = false

        // interactive frame
        let frame = new Phaser.GameObjects.Image(scene, 0, 0, 'bonusFrame').setInteractive()
        frame.displayWidth = BONUS_IMAGE_SIDE + 16
        frame.displayHeight = BONUS_IMAGE_SIDE + 16


        this.add(frame)

        // on click, show price, change frame color and add the price to the score
        frame.on('pointerdown', () => {
            // check whether its already been opened
            if (this.open) return
            this.open = true

            // change the frame color
            frame.setFrame(1)

            let priceIndex = scene.get_next_price() as number

            let priceImage: Phaser.GameObjects.Image
            // decide if it should add the skull or a price image
            if(priceIndex < 0){
                priceImage = new Phaser.GameObjects.Image(scene, 0, 0, 'skull')
                scene.finish_bonus()
            }
            else{
                priceImage = new Phaser.GameObjects.Image(scene, 0, 0, 'bonusItems', priceIndex)
                scene.score.add(postDict[priceIndex])
            }
            priceImage.displayWidth = BONUS_IMAGE_SIDE
            priceImage.displayHeight = BONUS_IMAGE_SIDE

            this.addAt(priceImage, 0)


        })
    }
}
