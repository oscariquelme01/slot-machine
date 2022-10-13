import MainScene, { ITEM_LENGTH, NUMBER_ITEMS, NUM_SLOTS } from "../scenes/mainScene"

// each item will go from INITIAL_Y to END_Y in ROUND_DURATION ms for NUM_ROUNDS rounds
const ROUND_DURATION = 300
export const INITIAL_Y = 100
const END_Y = 600

export default class slot {
    scene: MainScene
    pos_slot: number
    x: number
    results: number[]
    spinning_tween: Phaser.Tweens.Tween
    results_ready: boolean

    // x & y will determine the starting point of the slot 
    constructor(scene: MainScene, x: number, pos_slot: number) {

        this.scene = scene
        this.x = x
        this.pos_slot = pos_slot

        this.scene.items[this.pos_slot] = []

        // add images
        for (let i = 0; i < NUMBER_ITEMS; i++) {
            var image = this.scene.add.image(this.x, INITIAL_Y, 'slotItems', i)
            image.setDepth(-1)
            // name acts as id since the arrays will be shuffled and the position no longer serves as identifier
            image.setName(`${i}`)
            this.scene.items[this.pos_slot][i] = image
        }

        // necessary so that all the slots don't look the same
        this.shuffleArray(this.scene.items[this.pos_slot])

        // Add the slot to the scene
        var velocity = (END_Y - INITIAL_Y) / ROUND_DURATION //px/s
        var delay = ITEM_LENGTH / velocity


        this.spinning_tween = this.scene.tweens.add({
            targets: this.scene.items[this.pos_slot],
            y: { from: INITIAL_Y, to: END_Y },
            duration: ROUND_DURATION,
            delay: this.scene.tweens.stagger(delay, {}),
            // loop: -1, 
            repeat: -1,
            paused: true
        })

        this.spinning_tween.addListener('stop', () => {
            // Finish the round
            this.scene.tweens.add({
                targets: this.scene.items[this.pos_slot],
                y: `+=${END_Y}`,
                duration: ROUND_DURATION,
                onComplete: this.show_result,
                onCompleteParams: [this.scene, this.pos_slot],
                onCompleteScope: this
            })
            this.spinning_tween.pause()
        })
    }

    // callback to generate and show a random result after spinning the slot
    show_result(_: Phaser.Tweens.Tween, items: Phaser.GameObjects.Image[]) {

        this.results = []
        var random_items: Phaser.GameObjects.Image[] = []

        // get random items
        for (let i = 0; i < 3; i++) {
            var num_in_array = false

            // make sure the number is not repeated
            while (!num_in_array) {
                let random_num = Math.floor(Math.random() * NUMBER_ITEMS)

                if (!this.results.includes(random_num)) {
                    this.results[i] = random_num
                    num_in_array = true
                }
            }
            // ger random image 
            random_items[i] = items[this.results[i]]
            random_items[i].setY(INITIAL_Y)
        }

        // i = 2 because there are 3 lines, 2+i and ITEM_LENGTH + 9 act as margin to get the right values
        // TODO: this is horrible
        for (let i = 2; i >= 0; i--) {
            var y = INITIAL_Y + (2 + i) * (ITEM_LENGTH + 9)
            let duration = i == 0 ?  ROUND_DURATION * 1.5 :  ROUND_DURATION / i
            this.scene.add.tween({ targets: random_items[i], y: y, duration: duration})
        this.results_ready = true 
        }
    }

    // Durstenfeld shuffle array algorithm 
    shuffleArray(array: any[]) {
        for (var i = array.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
    }

}
