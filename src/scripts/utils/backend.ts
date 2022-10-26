const BACKEND_MIN_WAIT = 3

export default class Backend {

    sim_time() {
        // Generate a random between random_min and random_max
        const random_max = 6
        const random_min = 1
        const random_range = random_max - random_min
        let random_backend_time = Math.floor(Math.random() * random_range) + random_min

        // is the random generated backend time less than the minimum time to wait?
        if (random_backend_time < BACKEND_MIN_WAIT) { random_backend_time = BACKEND_MIN_WAIT }

        return random_backend_time
    }

    sim_bonus_result() {
        // Generate a random between bonus_min and bonux_max
        const bonus_min = 200
        const bonus_max = 50
        const random_range = bonus_min - bonus_max
        let bonus = Math.floor(Math.random() * random_range) + bonus_min

        return bonus
    }

}
