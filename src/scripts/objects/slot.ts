import MainScene, { ITEM_LENGTH, NUMBER_ITEMS, NUM_SLOTS } from "../scenes/mainScene"

// each item will go from INITIAL_Y to END_Y in ROUND_DURATION ms for NUM_ROUNDS rounds
const ROUND_DURATION = 150
export const INITIAL_Y = -90
const END_Y = 200

export default class slot {
    scene: MainScene
    pos_slot: number
    x: number
    results: number[]
    spinning_tween: Phaser.Tweens.Tween
    results_ready: boolean
    container: Phaser.GameObjects.Container
    y_positions: {[y: number]: number}

    // x & y will determine the starting point of the slot 
    constructor(scene: MainScene, x: number, pos_slot: number) {

        this.scene = scene
        this.x = x
        this.pos_slot = pos_slot

        // this variable will keep track of the positions of each image
        this.y_positions = {}

        this.scene.items[this.pos_slot] = []
        this.container = this.scene.add.container(x, INITIAL_Y)
        this.container.setDepth(-1)

        // add images
        for (let i = 0; i < NUMBER_ITEMS; i++) {
            var y = INITIAL_Y + (2 + i) * (ITEM_LENGTH + 7)
            this.y_positions[y] = i

            var image = this.scene.add.image(0, y, 'slotItems', i)
            this.container.add(image)

            // name acts as id since the arrays will be shuffled and the position no longer serves as identifier
            image.setName(`${i}`)

            // shouldn't be necessary
            this.scene.items[this.pos_slot][i] = image
        }

        // necessary so that all the slots don't look the same
        this.shuffleArray(this.scene.items[this.pos_slot]) // TODO: do this elsewhere

        // Add the slot to the scene
        this.spinning_tween = this.scene.tweens.add({
            targets: this.container,
            y: { from: INITIAL_Y, to: END_Y },
            duration: ROUND_DURATION,
            loop: -1, 
            onLoop: this.rearrange_items,
            onLoopScope: this,
            paused: true
        })

        this.spinning_tween.addListener('stop', () => {
            // Finish the round
            this.scene.tweens.add({
                targets: this.container,
                y: { from: INITIAL_Y, to: END_Y },
                duration: ROUND_DURATION * 4,
                ease: 'Bounce.Out',
                // delay: ROUND_DURATION * this.pos_slot,
                onComplete: this.show_result,
                onCompleteParams: [this.scene, this.pos_slot],
                onCompleteScope: this
            })
            this.spinning_tween.pause()
        })
    }

    rearrange_items() {

        let keys = Object.keys(this.y_positions)
        let top_keys = keys.slice(0, 3)

        // Randomize the 3 top items for the next round and reposition the 3 top items from the previous round to be the 3 bottom items
        for(let i = 0; i < top_keys.length; i++){
            let top_image = this.container.list[this.y_positions[top_keys[i]]] as Phaser.GameObjects.Image

            let rand = Math.floor(Math.random() * NUMBER_ITEMS)
            let random_image = this.container.list[rand] as Phaser.GameObjects.Image
            
            // swap the images
            this.swap_images(top_image, random_image, top_keys[i], keys[rand])
        }

    }

    swap_images(image_1: Phaser.GameObjects.Image, image_2: Phaser.GameObjects.Image, key_1: string, key_2: string) {
        const y_aux = image_1.y 
        image_1.y = image_2.y
        image_2.y = y_aux

        const aux = this.y_positions[key_1]
        this.y_positions[key_1] = this.y_positions[key_2]
        this.y_positions[key_2] = aux
    }

    // callback to generate and show a random result after spinning the slot
    show_result() {
        let items = this.scene.items[this.pos_slot]

        // Randomize the results
        this.shuffleArray(items)
        this.results = []

        var random_items: Phaser.GameObjects.Image[] = []

        for(let i = 0; i < 3; i++){
            this.results[i] = Number(items[i].name)
            // var y = INITIAL_Y + (2 + i) * (ITEM_LENGTH + 9)
            // this.y_positions[i] = y
            // let duration = i == 0 ?  ROUND_DURATION * 1.5 :  ROUND_DURATION / i
            // random_items[i] = items[i]
            // random_items[i].setY(INITIAL_Y)
            // this.scene.add.tween({ targets: random_items[i], y: y, duration: duration})
        }


        this.results_ready = true 
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
