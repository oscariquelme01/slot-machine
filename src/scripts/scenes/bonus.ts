import BonusItem, { BONUS_IMAGE_SIDE } from "../objects/bonusItems"
import Score from "../objects/score"

// number of clickable containers shown in the scene
const MAX_NUM_PRICES = 9

const Y_PRICES_POS = [110, 360, 610]
const X_PRICES_POS = [150, 375, 600]

// Possible values for the prices
export const prices = [10, 20, 50, 100]

// price to position in the sorted array
const priceDict = {50: 0, 100: 1, 10: 2, 20: 3}
// position to price in the sorted array
export const postDict = {0: 50, 1: 100, 2: 10, 3: 20}

export default class BonusScene extends Phaser.Scene {
    score: Score
    bonusPrices: Array<BonusItem>
    prices: Array<number>

    constructor(){
        super({key: 'BonusScene'})

    }

    preload(){
        this.load.image('bonusBackground', 'assets/img/bonus-bg.jpg')
        this.load.image('skull', 'assets/img/skull.png')
        this.load.spritesheet('bonusItems', 'assets/sprites/bonus.jpg', { frameWidth: BONUS_IMAGE_SIDE, frameHeight: BONUS_IMAGE_SIDE, margin: 10})
        this.load.spritesheet('bonusFrame', 'assets/sprites/box.png', {frameWidth: 490, frameHeight: 490, margin: 14, spacing: 28})
        this.load.image('bonusBoard', 'assets/img/Bonus-board.png')
        this.load.image('x', 'assets/img/X.png')
    }

    create(data){
        // set background image
        this.add.image(640, 360, 'bonusBackground')

        // set board
        let board = this.add.image(1020, 300, 'bonusBoard')
        board.displayHeight = 500
        board.displayWidth = 450

        this.add.image(960, 640, 'scoreFrame')
        this.score = new Score(this, 830, 605, data['balance'])

        // get the prices
        this.prices = this.greedy_prices_distribution(data['bonus'])

        this.bonusPrices = []

        for(let i = 0; i < MAX_NUM_PRICES; i++){
            // weird way to iterate through a 3 x 3 matrix with out 2 loops
            let y_index = Math.floor(i / Y_PRICES_POS.length)
            let x_index = i - X_PRICES_POS.length * y_index 

            let x = X_PRICES_POS[x_index]
            let y = Y_PRICES_POS[y_index]

            this.bonusPrices[i] = new BonusItem(this, x, y)
            this.add.existing(this.bonusPrices[i])

        }

        console.log('price: ', data['bonus'])
    }

    update(){

    }

    // implements a greedy algorithm to solve the price problem in the minimum number of steps posible by selecting the best local solution
    greedy_prices_distribution(price: number){
        let solution: Array<number> = []

        for (let i = prices.length; i >= 0; i--){

            while(price >= prices[i]){
                price -= prices[i]
                solution.push(priceDict[String(prices[i])])
            }
        }

        // shuffle the array to make it look more random
        Phaser.Utils.Array.Shuffle(solution)

        // -1 will represent the skull
        solution.push(-1)

        return solution
    }

    get_next_price(){
        return this.prices.shift()
    }

    finish_bonus(){
        let x = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'x')
        x.displayWidth = 800
        x.displayHeight = 800

        this.tweens.add(
            {targets: x,
             alpha: {from: 0, to: 1},
             loop: 2,
             duration: 500,
             onComplete: ()=> {
                this.scene.start('MainScene', {balance: this.score.text})
             }
            })

    }
}
