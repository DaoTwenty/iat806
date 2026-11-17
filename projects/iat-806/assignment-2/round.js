// page classses to show target and play round

class PresentPage extends Page {

    render() {
        this.engine.face.drawVideo();
        this.engine.draw_status();
        this.engine.bigText(`Level ${this.engine.current_level_idx}`, `${this.engine.level.bpm} BPM`);
        if (this.engine.state_duration() > 1500) {
            this.engine.move_to_state(State.LISTEN);
        }
    }

}

// the game plays the pattern and shows it
class ListenPage extends Page {

    enter() {
        this.engine.last_click = -1;
        this.engine.level.startPlayback();
    }

    render() {
        let level = this.engine.level;
        let elapsed = this.engine.state_duration() - 500;
        this.engine.metronome(elapsed, level.duration());
        for (let beat of level.updatePlayback(elapsed)) {
            this.engine.sound.play(beat.inst);
            this.engine.timeline.flash(beat.inst);
        }

        this.engine.face.drawVideo();
        this.engine.timeline.render(level.num_steps);
        for (let beat of level.pattern) {
            beat.render(this.engine.timeline, level.num_steps, COLORS[beat.inst], beat.played);
        }
        this.engine.timeline.render_playhead(elapsed / level.step_ms, level.num_steps);
        this.engine.draw_status();
        this.engine.bigText("LISTEN");

        if (elapsed > level.duration() + 400) {
            this.engine.move_to_state(State.COUNTDOWN);
        }
    }

}

// countdown before start of round.
class CountdownPage extends Page {

    enter() {
        this.engine.last_click = -1;
        this.engine.attempt = [];
        this.engine.play_start = millis() + 4 * this.engine.level.beat_ms;
    }

    render() {
        let level = this.engine.level;
        this.engine.metronome(this.engine.state_duration(), 4 * level.beat_ms);

        this.engine.face.drawVideo();
        this.engine.face.drawFace();
        this.engine.timeline.render(level.num_steps);
        this.engine.draw_status();
        this.engine.bigText(min(4, floor(this.engine.state_duration() / level.beat_ms) + 1), "get ready");

        // start half a step early so an early first hit still counts
        if (millis() >= this.engine.play_start - level.step_ms / 2) {
            this.engine.move_to_state(State.PLAY);
        }
    }

}

// you play it back from memory
class PlayPage extends Page {

    enter() {
        this.engine.last_click = -1;
    }

    render() {
        let level = this.engine.level;
        let elapsed = millis() - this.engine.play_start;
        this.engine.metronome(elapsed, level.duration());

        this.engine.face.drawVideo();
        this.engine.face.drawFace();
        this.engine.timeline.render(level.num_steps);
        for (let hit of this.engine.attempt) {
            hit.render(this.engine.timeline, level.num_steps, 255, true);
        }
        this.engine.timeline.render_playhead(elapsed / level.step_ms, level.num_steps);
        this.engine.draw_status();
        this.engine.bigText("YOUR TURN");

        if (elapsed > level.duration() + level.step_ms) {
            this.engine.finishRound();
        }
    }

}

// visual result of what was correct, and what wasn't
class ResultPage extends Page {

    render() {
        let level = this.engine.level;
        let result = this.engine.result;

        this.engine.face.drawVideo();
        this.engine.timeline.render(level.num_steps);
        for (let beat of level.pattern) {
            beat.render(this.engine.timeline, level.num_steps, result.missed.includes(beat) ? "#ff4040" : COLORS[beat.inst], false);
        }
        for (let hit of this.engine.attempt) {
            hit.render(this.engine.timeline, level.num_steps, result.good.includes(hit) ? "#5bd75b" : "#ff4040", true);
        }
        this.engine.draw_status();
        this.engine.bigText(`${result.percent}%`, result.passed ? `+${result.points} points` : "missed it, -1 life");

        if (this.engine.state_duration() > 3000) {
            this.engine.afterResult();
        }
    }

}
