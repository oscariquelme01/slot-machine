import Score from '../objects/score'
import slot, { INITIAL_Y } from '../objects/slot'

export const ITEM_LENGTH = 82
export const NUMBER_ITEMS = 7
const GAP = 58

export const NUM_SLOTS = 3

const GAME_COST = 100
const LINE_PRICE = 1000

export default class MainScene extends Phaser.Scene {
    items : Phaser.GameObjects.Image[][]
    in_game : boolean
    score : Score
    button : Phaser.GameObjects.Sprite
    num_slots : number
    slots : slot[]
    timeline : Phaser.Tweens.Timeline
    first_time : Boolean

    constructor() {
        super({ key: 'MainScene' })
        this.num_slots = 0
        this.in_game = false
        this.first_time = true
    }

    preload(){
        this.load.spritesheet('slotItems', 'assets/sprites/spritesheet.png', {frameWidth: ITEM_LENGTH, frameHeight: ITEM_LENGTH, spacing: GAP, margin: 56})
        this.load.spritesheet('button', 'assets/sprites/button.png', {frameWidth: 288, frameHeight: 195})
        this.load.image('background', 'assets/img/bg.png')
        this.load.image('scoreFrame', 'assets/img/score-frame.png')
    }

    create() {
        var scene = this

        // add images
        this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'background')
        this.button = this.add.sprite(300, 623, 'button').setFrame(0).setInteractive()

        //score text
        this.add.image(960, 640, 'scoreFrame')
        this.score = new Score(this, 830, 605)

        // Create timeline to store tweens
        this.timeline = this.tweens.createTimeline({loop:-1, onLoop: this.end_turn, onLoopScope: this})
        this.timeline.on('resume', this.reset_items, this)
        
        // Create all the slots
        this.items = []
        var x_positions = [780, 960, 1140]
        this.slots = []

        for(let i = 0; i < NUM_SLOTS; i++){
            this.slots[i] = new slot(this, x_positions[i], this.num_slots)
            this.num_slots++;
        }

        //listen to click on button
        this.button.on('pointerdown', function(){

            if(scene.in_game == true) return
            scene.in_game = true

            if(scene.score.substract(GAME_COST))

            // Key will be set backed to frame 0 when the slots are done
            scene.button.setFrame(1)

            if(scene.first_time == true){
                scene.timeline.play()
                scene.first_time = false
            }
            else{
                scene.timeline.resume()
            }

        }, this)
        
    }

    // callback on loop for the main timeline 
    end_turn(){
        this.timeline.pause()

        // check results line by line
        let price = 0
        for(let i = 0; i < 3; i++){

            var slot_0_result = this.items[0][this.slots[0].results[i]].name
            var slot_1_result = this.items[1][this.slots[1].results[i]].name
            var slot_2_result = this.items[2][this.slots[2].results[i]].name
    
            if(slot_0_result == slot_1_result && slot_1_result == slot_2_result){
                price += LINE_PRICE
            }
        }

        if(price != 0) this.score.add(price)

        if(this.in_game == true){
            this.button.setFrame(0)
            this.in_game = false
        }
    }

    // callback on resume for the main timeline. Resets back all items for the next round. 
    // This is needed because the slot changes the y coordinate of the randomly picked items 
    reset_items(){
        
        for(let j = 0; j < NUM_SLOTS; j++){
            for(let i = 0; i < NUMBER_ITEMS; i++){
                this.items[j][i].setY(INITIAL_Y)
            }
        }
    }

    update() {

    }

}
