// visual timeline with play notes

class Timeline {

    constructor(x, y, w, h, instruments) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.instruments = instruments;
        // when each instrument was last hit, to light up its row
        this.flash_times = {};
    }

    // x position of a step (can be in-between, like 2.3 for a late hit)
    step_x_pos(step, num_steps) {
        return constrain(this.x + step * this.w / num_steps, this.x, this.x + this.w);
    }

    // y position of an instrument's row
    inst_y_pos(inst) {
        let i = this.instruments.indexOf(inst);
        return this.y + (i + 0.5) * this.h / this.instruments.length;
    }

    // light up an instrument's row when it's played
    flash(inst) {
        this.flash_times[inst] = millis();
    }

    render(num_steps) {
        push();

        // low alpha frame
        rectMode(CORNER);
        noStroke();
        fill(0, 160);
        rect(this.x - 50, this.y - 20, this.w + 100, this.h + 40);

        // we render each row (for each instrument)
        let row_h = this.h / this.instruments.length;
        textAlign(RIGHT, CENTER);
        for (let i = 0; i < this.instruments.length; i++) {
            let inst = this.instruments[i];
            let inst_y = this.inst_y_pos(inst);
            // row lit for a moment after a hit
            if (millis() - (this.flash_times[inst] || -1000) < 150) {
                noStroke();
                fill(255, 60);
                rect(this.x, inst_y - row_h / 2, this.w, row_h);
            }
            stroke(255, 30);
            line(this.x, inst_y, this.x + this.w, inst_y);
            noStroke();
            fill(COLORS[inst]);
            text(inst, this.x - 12, inst_y);
        } 

        for (let i = 0; i <= num_steps; i++) {
            let col_x = this.x + i * this.w / num_steps;
            stroke(255);
            line(col_x, this.y, col_x, this.y + this.h);
        }

        pop();

    }

    render_playhead(step, num_steps) {
        let x_playhead = this.step_x_pos(step, num_steps);
        push();
        stroke(255);
        strokeWeight(3);
        line(x_playhead, this.y - 6, x_playhead, this.y + this.h + 6);
        pop();
    }

}