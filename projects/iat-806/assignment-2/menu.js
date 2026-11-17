// landing menu page

class MenuPage extends Page {
    
    constructor(engine) {
        super(engine);
        this.start = new Button("Start", width / 2, height / 2 + 60, 220, 70);
    }

    render() {
        background(0);

        push();
        fill(255);
        textAlign(CENTER, CENTER);
        textSize(40);
        text("Echo Drummer", width / 2, 80);
        textSize(18);
        text("Listen to the beat, then play it back.", width / 2, 140);
        text("Tilt your head LEFT for kick, RIGHT for snare.", width / 2, 170);
        pop();

        this.start.render();
    }

    mousePressed() {
        if (this.start.contains(mouseX, mouseY)) {
            this.engine.startGame();
        }
    }

}