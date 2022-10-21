import MainScene, { ITEM_LENGTH, NUMBER_ITEMS, NUM_SLOTS } from "../scenes/mainScene"

// each item will go from INITIAL_Y to END_Y in ROUND_DURATION ms for NUM_ROUNDS rounds
const ROUND_DURATION = 200
export const INITIAL_Y = -90
const END_Y = 200

export default class slot {
    scene: MainScene
    pos_slot: number
    x: number
    results: number[]
    spinning_tween: Phaser.Tweens.Tween
    images_name: Array<number>
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

        this.images_name = []
        this.container = this.scene.add.container(x, INITIAL_Y)
        this.container.setDepth(-1)

        // add images
        for (let i = 0; i < NUMBER_ITEMS; i++) {
            var y = INITIAL_Y + (2 + i) * (ITEM_LENGTH + 7)
            this.y_positions[y] = i
            this.images_name[i] = i 

            var image = this.scene.add.image(0, y, 'slotItems', i)
            this.container.add(image)
        }

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
                onComplete: this.get_results,
                onCompleteParams: [this.scene, this.pos_slot],
                onCompleteScope: this
            })
            this.spinning_tween.pause()
        })
    }

    rearrange_items() {

        let keys = Object.keys(this.y_positions)
        let top_keys = keys.slice(0, 3)
        let bot_keys = keys.slice(3, 6)

        // Reposition the 3 top items from the previous round to be the 3 bottom items
        for(let i = 0; i < top_keys.length; i++){
            let top_image = this.container.list[this.y_positions[top_keys[i]]] as Phaser.GameObjects.Image
            let bot_image = this.container.list[this.y_positions[bot_keys[i]]] as Phaser.GameObjects.Image

            // swap the images
            this.swap_images(top_image, bot_image, top_keys[i], bot_keys[i])
        }

        // randomize the 3 top items for the next round
        this.randomize_next_round()

    }

    swap_images(image_1: Phaser.GameObjects.Image, image_2: Phaser.GameObjects.Image, key_1: string, key_2: string) {
        const frame_1 = this.y_positions[key_1]
        const frame_2 = this.y_positions[key_2]

        
        image_2.setFrame(frame_1)

        this.y_positions[key_1] = frame_2
        this.y_positions[key_2] = frame_1
    }

    randomize_next_round(){
        let keys = Object.keys(this.y_positions)

        for(let i = 0; i < NUMBER_ITEMS/2; i++){
            let image = this.container.list[i] as Phaser.GameObjects.Image

            let rand = Phaser.Utils.Array.GetRandom(this.images_name)
            image.setFrame(rand)
            
            this.y_positions[keys[i]] = rand
        }
    }

    // callback to set the random result after spinning the slot and signal that the results are ready
    get_results() {

        this.results = []

        let result_keys = Object.keys(this.y_positions).slice(0, 3)

        for(let i = 0; i < NUMBER_ITEMS/2; i++){
            this.results[i] = Number(this.y_positions[result_keys[i]])
            console.log(`${ this.pos_slot } : ${ this.results[i] }`)
            // const img = this.container.list[this.results[i]] as Phaser.GameObjects.Image
            // img.setFrame(this.results[i])
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
