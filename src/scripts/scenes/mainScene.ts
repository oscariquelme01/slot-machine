import slot from '../objects/slot'

export const ITEM_LENGTH = 82
export const NUMBER_ITEMS = 16
const GAP = 58

export const NUM_SLOTS = 3

export default class MainScene extends Phaser.Scene {
    items : Phaser.GameObjects.Image[][]
    in_game : boolean
    button : Phaser.GameObjects.Sprite
    num_slots : number
    slots : slot[]

    constructor() {
        super({ key: 'MainScene' })
        this.num_slots = 0
        this.in_game = false
    }

    preload(){
        this.load.spritesheet('slotItems', 'assets/sprites/spritesheet.png', {frameWidth: ITEM_LENGTH, frameHeight: ITEM_LENGTH, spacing: GAP, margin: 56})
        this.load.spritesheet('button', 'assets/sprites/button.png', {frameWidth: 288, frameHeight: 195})
        this.load.image('background', 'assets/img/bg.png')
    }

    create() {
        var scene = this

        this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'background')
        this.button = this.add.sprite(300, 623, 'button').setFrame(0).setInteractive()

        // Create all the slots
        this.items = []
        var x_positions = [780, 960, 1140]
        this.slots = []

        for(let i = 0; i < NUM_SLOTS; i++){
            this.slots[i] = new slot(this, x_positions[i], this.num_slots)
            this.num_slots++;
        }

        this.input.on('pointerdown', function(){
            // Key will be set backed to frame 0 when the slots are done
            scene.button.setFrame(1)
            scene.slots[0].run()
            scene.slots[1].run()
            scene.slots[2].run()
            scene.in_game = true
        }, this)

        
    }

    update() {

    }

}
