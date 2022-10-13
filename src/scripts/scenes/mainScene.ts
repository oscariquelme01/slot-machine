import Score from '../objects/score'
import slot, { INITIAL_Y } from '../objects/slot'

export const ITEM_LENGTH = 82
export const NUMBER_ITEMS = 7
const GAP = 58

export const NUM_SLOTS = 3

const GAME_COST = 100
const LINE_PRICE = 1000
const BACKEND_MIN_WAIT = 3

export default class MainScene extends Phaser.Scene {
    items: Phaser.GameObjects.Image[][]
    in_game: boolean
    score: Score
    button: Phaser.GameObjects.Sprite
    num_slots: number
    slots: slot[]
    first_time: Boolean

    constructor() {
        super({ key: 'MainScene' })
        this.num_slots = 0
        this.in_game = false
        this.first_time = true
    }

    preload() {
        this.load.spritesheet('slotItems', 'assets/sprites/spritesheet.png', { frameWidth: ITEM_LENGTH, frameHeight: ITEM_LENGTH, spacing: GAP, margin: 56 })
        this.load.spritesheet('button', 'assets/sprites/button.png', { frameWidth: 288, frameHeight: 195 })
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

        // Create all the slots
        this.items = []
        var x_positions = [780, 960, 1140]
        this.slots = []

        for (let i = 0; i < NUM_SLOTS; i++) {
            this.slots[i] = new slot(this, x_positions[i], this.num_slots)
            this.num_slots++;
        }

        //listen to click on button
        this.button.on('pointerdown', function() {

            if (scene.in_game == true) return
            scene.in_game = true

            scene.score.substract(GAME_COST)

            // Key will be set back to frame 0 when the slots are done
            scene.button.setFrame(1)

            // Launch the slots with a simulated backend time
            scene.launch_slots()
        }, this)

    }

    // callback on loop for the main timeline 
    end_turn() {
        console.log('end turn')

        // check results line by line
        let price = 0
        for (let i = 0; i < 3; i++) {

            var slot_0_result = this.items[0][this.slots[0].results[i]].name
            var slot_1_result = this.items[1][this.slots[1].results[i]].name
            var slot_2_result = this.items[2][this.slots[2].results[i]].name

            if (slot_0_result == slot_1_result && slot_1_result == slot_2_result) {
                price += LINE_PRICE
            }
        }

        if (price != 0) this.score.add(price)

        if (this.in_game == true) {
            this.button.setFrame(0)
            this.in_game = false
        }
    }

    update() {
        if(this.in_game == true){
            let counter = 0
            for(let i = 0; i < NUM_SLOTS; i++){
                if (this.slots[i].results_ready == true){
                    counter++
                }
            }

            if (counter == NUM_SLOTS){
                for(let i = 0; i < NUM_SLOTS; i++){
                    this.slots[i].results_ready = false
                }
                
                // set results back to false
                this.end_turn()
            }
        }
    }

    backend_sim() {
        // Generate a random between random_min and random_max
        const random_max = 6
        const random_min = 1
        const random_range = random_max - random_min
        let random_backend_time = Math.floor(Math.random() * random_range) + random_min

        // is the random generated backend time less than the minimum time to wait?
        if (random_backend_time < BACKEND_MIN_WAIT) { random_backend_time = BACKEND_MIN_WAIT }

        return random_backend_time
    }

    launch_slots() {
        // Random backend time simulation. The slot will spin for as much as needed in a real case.
        let random_backend_time = this.backend_sim()

        // simulate waiting for the backend
        setTimeout(() => {
            // flag the spinning tweens as complete so that the complete callbacks execute
            for (let i = 0; i < NUM_SLOTS; i++) {
                this.slots[i].spinning_tween.emit('stop')
            }

        }, random_backend_time * 1000) // ms

        // launch the slots
        for (let i = 0; i < NUM_SLOTS; i++) {
            if (this.first_time == true) {
                this.slots[i].spinning_tween.resume()
            }
            else {
                this.slots[i].spinning_tween.restart()
                this.slots[i].spinning_tween.resume()
            }
        }

        if (this.first_time == true) this.first_time = false
    }
}
