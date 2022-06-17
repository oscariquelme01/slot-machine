import FpsText from '../objects/fpsText'

const ITEM_LENGTH = 82
const DURATION = 300
const NUMBER_ITEMS = 16
const INITIAL_Y = 100
const GAP = 58
const END_Y = 600

export default class MainScene extends Phaser.Scene {
    fpsText : FpsText
    background : Phaser.GameObjects.Image
    items : Phaser.GameObjects.Image[]

    constructor() {
        super({ key: 'MainScene' })
    }

    preload(){
        this.load.spritesheet('slotItems', 'assets/sprites/spritesheet.png', {frameWidth: ITEM_LENGTH, frameHeight: ITEM_LENGTH, spacing: GAP, margin: 56})
        this.load.image('background', 'assets/img/bg.png')
    }

    create() {
        this.fpsText = new FpsText(this)
        this.background = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'background')
        this.items = []

        for(let i = 0; i < NUMBER_ITEMS; i++){
            var image = this.add.image(780, 100, 'slotItems', i)
            image.setDepth(-1)
            this.items[i] = image
        }

        var velocity = (END_Y - INITIAL_Y) / DURATION //px/s
        var delay = ITEM_LENGTH / velocity

        this.tweens.add({targets: this.items, y: END_Y, Ease:'power0', duration: DURATION, delay: this.tweens.stagger(delay, {}), repeat: 3, repeatDelay: delay, onComplete: this.show_result, onCompleteParams: [this]})

    }

    update() {
        this.fpsText.update()
    }

    show_result(_: Phaser.Tweens.Tween, items: Phaser.GameObjects.Image[], scene: MainScene){
        var random_results : number[] = []
        var random_items : Phaser.GameObjects.Image[] = []
        for(let i = 0; i < 3; i++){
            var num_in_array = false
            while (!num_in_array){
                let random_num = Math.floor(Math.random()* NUMBER_ITEMS)

                if (!random_results.includes(random_num)){
                    random_results[i] = random_num
                    num_in_array = true
                }
            }
            random_items[i] = items[random_results[i]]
            random_items[i].setY(INITIAL_Y)
        }

        /*Position results*/
        for(let i = 2; i >= 0; i--){
            var y = INITIAL_Y + (2+i) * (ITEM_LENGTH + 9)
            scene.add.tween({targets: random_items[i], y: y, duration: 450, }) }
    }
}
