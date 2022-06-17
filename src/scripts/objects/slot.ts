import MainScene, { ITEM_LENGTH, NUMBER_ITEMS, NUM_SLOTS} from "../scenes/mainScene"

// each item will go from INITIAL_Y to END_Y in ROUND_DURATION ms for NUM_ROUNDS rounds
const ROUND_DURATION = 300
const INITIAL_Y = 100
const END_Y = 600
const NUM_ROUNDS = 3

export default class slot {
    scene: MainScene
    pos_slot: number
    x: number

    // x & y will determine the starting point of the slot 
    constructor(scene: MainScene, x: number, pos_slot: number){

        this.scene = scene
        this.x = x
        this.pos_slot = pos_slot

        this.scene.items[this.pos_slot] = []

        for(let i = 0; i < NUMBER_ITEMS; i++){
            var image = this.scene.add.image(this.x, INITIAL_Y, 'slotItems', i)
            image.setDepth(-1)
            this.scene.items[this.pos_slot][i] = image
        }

        this.shuffleArray(this.scene.items[this.pos_slot])
    }
    
    run(){
        var velocity = (END_Y - INITIAL_Y) / ROUND_DURATION //px/s
        var delay = ITEM_LENGTH / velocity

        // Add the slot to the scene
        this.scene.tweens.add({targets: this.scene.items[this.pos_slot], y: END_Y, Ease:'power0', duration: ROUND_DURATION, 
            delay: this.scene.tweens.stagger(delay, {}), repeat: NUM_ROUNDS, repeatDelay: delay, 
            onComplete: this.show_result, onCompleteParams: [this.scene, this.pos_slot]})
    }

    // callback to generate and show a random result after spinning the slot
    show_result(_: Phaser.Tweens.Tween, items: Phaser.GameObjects.Image[], scene: MainScene){
        var random_results : number[] = []
        var random_items : Phaser.GameObjects.Image[] = []

        for(let i = 0; i < NUM_SLOTS; i++){
            var num_in_array = false

            // make sure the number is not repeated
            while (!num_in_array){
                let random_num = Math.floor(Math.random()* NUMBER_ITEMS)

                if (!random_results.includes(random_num)){
                    random_results[i] = random_num
                    num_in_array = true
                }
            }

            // ger random image 
            random_items[i] = items[random_results[i]]
            random_items[i].setY(INITIAL_Y)
        }

        // i = 2 because there are 3 lines, 2+i and ITEM_LENGTH + 9 act as margin to get the right values
        for(let i = 2; i >= 0; i--){
            var y = INITIAL_Y + (2+i) * (ITEM_LENGTH + 9)
            scene.add.tween({targets: random_items[i], y: y, duration: 450, }) 
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
