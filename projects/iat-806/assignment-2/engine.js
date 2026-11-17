// game engine that handles game logic

const NUM_LEVELS = 5;
const NUM_LIVES = 3;
const SUCCESS_PERCENT = 50;

const INSTRUMENTS = ["kick", "snare"];
const COLORS = { kick: "#e4572e", snare: "#29a19c" };

const State = {
    LOADING : "loading",
    MENU : "menu",
    PRESENT : "present",
    LISTEN : "listen",
    COUNTDOWN : "countdown",
    PLAY : "play",
    RESULT : "result",
    GAMEOVER : "gameover"
};

// all drum sound files
function soundFiles() {
    let files = {
        kick: "assets/kick.wav",
        snare: "assets/snare.wav",
        click: "assets/click.wav",
        click_hi: "assets/click_hi.wav",
    };
    return files;
}

// class for the game engine
class GameEngine {

    constructor() {
        this.state = State.LOADING;
        this.state_start = 0;
        this.current_level_idx = 0;
        this.level = null;
        this.score = 0;
        this.lives = NUM_LIVES;
        this.game_won = false;

        this.result = null;
        // player hits
        this.attempt = [];     
        // player hit start time  
        this.play_start = 0;    
        this.last_click = -1;   

        this.sound = new SoundEngine();
        this.face = new FaceInput();
        this.timeline = new Timeline(70, 30, 500, 90, INSTRUMENTS);

        this.pages = {
            [State.LOADING]: new LoadingPage(this),
            [State.MENU]: new MenuPage(this),
            [State.PRESENT]: new PresentPage(this),
            [State.LISTEN]: new ListenPage(this),
            [State.COUNTDOWN]: new CountdownPage(this),
            [State.PLAY]: new PlayPage(this),
            [State.RESULT]: new ResultPage(this),
            [State.GAMEOVER]: new GameOver(this),
        }
    }

    // running while loading page runs
    async load() {
        await this.sound.load(soundFiles());
        await this.face.setup();
        this.move_to_state(State.MENU);
    }

    move_to_state(state) {
        this.state = state;
        this.state_start = millis();
        this.pages[state].enter();
    }

    state_duration() {
        return millis() - this.state_start;
    }

    async startGame() {
        await this.sound.start();
        this.score = 0;
        this.lives = NUM_LIVES;
        this.current_level_idx = 0;
        this.game_won = false;
        this.nextLevel();
    }

    nextLevel() {
        this.current_level_idx += 1;
        this.level = new Level(this.current_level_idx);
        this.move_to_state(State.PRESENT);
    }

    finishRound() {
        // remove hits that landed outside the round, they don't count
        for (let i = this.attempt.length - 1; i >= 0; i--) {
            let step = this.attempt[i].step;
            if (step < -MAX_ERROR || step > this.level.num_steps) {
                this.attempt.splice(i, 1);
            }
        }
        this.result = this.level.score(this.attempt);
        this.result.passed = this.result.percent >= SUCCESS_PERCENT;
        if (this.result.passed) {
            this.score += this.result.points;
        } else {
            this.lives -= 1;
        }
        this.move_to_state(State.RESULT);
    }

    // results caan lead to a gameover, restart, next level, or success
    afterResult() {
        if (this.lives <= 0) {
            this.move_to_state(State.GAMEOVER);
        } else if (!this.result.passed) {
            this.move_to_state(State.PRESENT);
        } else if (this.current_level_idx >= NUM_LEVELS) {
            this.game_won = true;
            this.move_to_state(State.GAMEOVER);
        } else {
            this.nextLevel();
        }
    }

    render() {
        this.face.update();
        for (let inst of this.face.hits) {
            this.hit(inst, FACE_LATENCY_MS);
        }
        this.pages[this.state].render();
    }

    // the player hit a drum: play it, and record it during PLAY
    hit(inst, latency) {
        if (this.state != State.MENU && this.state != State.PLAY) {
            return;
        }
        this.sound.play(inst);
        this.timeline.flash(inst);
        if (this.state == State.PLAY) {
            let time = millis() - this.play_start - latency;
            this.attempt.push(new Beat(inst, time / this.level.step_ms));
        }
    }

    // a quiet click on every beat between 0 and total_ms
    metronome(elapsed, total_ms) {
        let beat = floor(elapsed / this.level.beat_ms);
        if (elapsed >= 0 && elapsed < total_ms && beat > this.last_click) {
            this.last_click = beat;
            this.sound.play(beat % 4 == 0 ? "click_hi" : "click", 0.3);
        }
    }

    draw_status() {
        push();
        fill(255);
        noStroke();
        textSize(16);
        textAlign(LEFT, CENTER);
        text(`Level ${this.current_level_idx} / ${NUM_LEVELS}`, 20, 155);
        textAlign(RIGHT, CENTER);
        text(`Score ${this.score}   Lives ${this.lives}`, width - 20, 155);
        pop();
    }

    bigText(msg, sub = "") {
        push();
        fill(255);
        stroke(0);
        strokeWeight(5);
        textAlign(CENTER, CENTER);
        textSize(48);
        text(msg, width / 2, 250);
        textSize(18);
        strokeWeight(3);
        text(sub, width / 2, 300);
        pop();
    }

    mousePressed() {
        this.pages[this.state].mousePressed();
    }

    // keyboard backup, to test without a camera
    keyPressed() {
        if (key == "f") this.hit("kick", 0);
        if (key == "j") this.hit("snare", 0);
    }

}
