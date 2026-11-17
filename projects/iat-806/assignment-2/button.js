// class for clickable button

class Button {

    constructor(label, x, y, w, h) {
        this.label = label;
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }

    // check if position in button, 
    // useful for detecting when button is clicked or hovered
    contains(px, py) {
        return abs(px - this.x) < this.w / 2 && abs(py - this.y) < this.h / 2;
    }

    // render the butotn
    render() {
        push();

        rectMode(CENTER);

        // change color when hovered
        fill(this.contains(mouseX, mouseY) ? "#b51d1d" : "#881414");

        // draw button
        rect(this.x, this.y, this.w, this.h);

        // write text label
        fill(255);
        textAlign(CENTER, CENTER);
        textSize(this.h * 0.5);
        text(this.label, this.x, this.y);
        
        pop();

    }

}