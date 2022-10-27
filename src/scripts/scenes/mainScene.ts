import Score from '../objects/score'
import slot from '../objects/slot'
import Backend from '../utils/backend'

export const ITEM_LENGTH = 82
export const NUMBER_ITEMS = 6
const GAP = 58

export const NUM_SLOTS = 3

const GAME_COST = 100
const LINE_PRICE = 1000

const BONUS_SYMBOL = 0
const MIN_BONUS_FREQUENCY = 3

const INITIAL_BALANCE = '100000'


export default class MainScene extends Phaser.Scene {
    items: Phaser.GameObjects.Image[][]
    in_game: boolean
    score: Score
    button: Phaser.GameObjects.Sprite
    num_slots: number
    slots: slot[]
    first_time: Boolean
    backend: Backend

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

    create(data) {
        var scene = this

        // add images
        this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'background')
        this.button = this.add.sprite(300, 623, 'button').setFrame(0).setInteractive()

        // score text
        this.add.image(960, 640, 'scoreFrame')
        let balance = data['balance'] == undefined ? INITIAL_BALANCE : data['balance']
        this.score = new Score(this, 830, 605, balance)

        // backend
        this.backend = new Backend()

        // Create all the slots
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

        // check results line by line
        let price = 0
        let bonus_count = 0

        // iterate through all the lines
        for (let i = 0; i < 3; i++) {

            let slot_results: Array<number> = []

            // store results into array
            for (let j = 0; j < NUM_SLOTS; j++) {
                slot_results[j] = this.slots[j].results[i]
            }

            // check if all elements in array are equal, if so, add to price
            if (slot_results.every(
                r => { if (r == slot_results[0]) return true })) {
                price += LINE_PRICE
            }

            // check for the bonus symbol frequency
            for (const r of slot_results) {
                bonus_count += Number(r == BONUS_SYMBOL)
            }
        }

        if (price != 0) this.score.add(price)

        bonus_count = MIN_BONUS_FREQUENCY
        // check for bonus
        if (bonus_count >= MIN_BONUS_FREQUENCY) {
            // generate bonus random result
            let bonus = this.backend.sim_bonus_result()

            this.scene.start('BonusScene', { bonus: bonus, balance: this.score.text})
        }


        if (this.in_game == true) {
            this.button.setFrame(0)
            this.in_game = false
        }
    }

    update() {
        if (this.in_game == true) {
            let counter = 0
            for (let i = 0; i < NUM_SLOTS; i++) {
                if (this.slots[i].results_ready == true) {
                    counter++
                }
            }

            if (counter == NUM_SLOTS) {
                for (let i = 0; i < NUM_SLOTS; i++) {
                    this.slots[i].results_ready = false
                }

                // set results back to false
                this.end_turn()
            }
        }
    }

    launch_slots() {
        // Random backend time simulation. The slot will spin for as much as needed in a real case.
        let random_backend_time = this.backend.sim_time()

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
