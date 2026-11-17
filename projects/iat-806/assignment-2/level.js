// class for a level, defined by difficulty

const LEVEL_SETTINGS = [
    { bpm: 80,  num_steps: 8,  density: 0.35 },
    { bpm: 85,  num_steps: 8,  density: 0.45 },
    { bpm: 90,  num_steps: 12, density: 0.45 },
    { bpm: 95,  num_steps: 16, density: 0.5 },
    { bpm: 100, num_steps: 16, density: 0.55 },
];

// thresholdd to stay under to pass the level.
const MAX_ERROR = 0.5;       
const EXTRA_PENALTY = 25;    

// drum hit defined by step position and instrument
class Beat {

    constructor(inst, step) {
        this.inst = inst;
        this.step = step;
        this.played = false;
        // set while scoring: a player's hit landed on this beat
        this.matched = false;
    }

    render(timeline, num_steps, col, filled) {
        let x = timeline.step_x_pos(this.step, num_steps);
        let y = timeline.inst_y_pos(this.inst);
        push();
        if (filled) {
            noStroke();
            fill(col);
            circle(x, y, 14);
        } else {
            noFill();
            stroke(col);
            strokeWeight(2);
            circle(x, y, 18);
        }
        pop();
    }

}

class Level {

    constructor(idx) {
        let settings = LEVEL_SETTINGS[idx - 1];
        this.bpm = settings.bpm;
        this.num_steps = settings.num_steps;
        this.density = settings.density;
        this.beat_ms = 60000 / this.bpm;     
        this.step_ms = this.beat_ms / 2;     

        // keep building until there are enough notes
        this.pattern = [];
        while (this.pattern.length < this.num_steps / 4 + 1) {
            this.create_random_pattern();
        }
        this.next_beat = 0;
    }

    // array of random onsets accross instruments
    create_random_pattern() {
        this.pattern = [];
        for (let step = 0; step < this.num_steps; step++) {
            // let's always start with a kick
            if (step == 0) {
                this.pattern.push(new Beat("kick", 0));
            } else if (random() < this.density) {
                this.pattern.push(new Beat(random(INSTRUMENTS), step));
            }
        }
    }

    duration() {
        return this.num_steps * this.step_ms;
    }

    startPlayback() {
        this.next_beat = 0;
        for (let beat of this.pattern) {
            beat.played = false;
        }
    }

    // the beats whose time has come since last frame
    updatePlayback(elapsed) {
        let due = [];
        while (this.next_beat < this.pattern.length &&
               this.pattern[this.next_beat].step * this.step_ms <= elapsed) {
            this.pattern[this.next_beat].played = true;
            due.push(this.pattern[this.next_beat]);
            this.next_beat++;
        }
        return due;
    }

    // scoring
    score(attempt) {
        for (let beat of this.pattern) {
            beat.matched = false;
        }
        let good = [];
        let extra = [];
        for (let hit of attempt) {
            let found = null;
            for (let beat of this.pattern) {
                if (!beat.matched && beat.inst == hit.inst && abs(beat.step - hit.step) <= MAX_ERROR) {
                    found = beat;
                    break;
                }
            }
            if (found) {
                found.matched = true;
                good.push(hit);
            } else {
                extra.push(hit);
            }
        }
        let missed = [];
        for (let beat of this.pattern) {
            if (!beat.matched) {
                missed.push(beat);
            }
        }
        // 100 points per good hit, minus a penalty per extra hit
        let points = max(0, good.length * 100 - extra.length * EXTRA_PENALTY);
        let percent = round(points / this.pattern.length);
        return { points: points, percent: percent, good: good, extra: extra, missed: missed };
    }

}
