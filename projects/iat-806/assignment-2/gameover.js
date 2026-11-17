// page for gameover

class GameOver extends Page {

    constructor(engine) {
        super(engine);
        this.play_again = new Button(
            "Try Again", 
            width / 2,
            height / 2 + 60,
            200,
            70
        )
    }

    render() {
        background(0);
        push(); 
        fill(255);
        textAlign(CENTER, CENTER);
        textSize(26);
        if (this.engine.game_won) {
            text(`You won with the score ${this.engine.score}! Congrats!`, width/2, height/2 - 60);
        } else {
            text(`You lost with the score ${this.engine.score}! Try again!`, width/2, height/2 - 60);
        }
        pop();
        this.play_again.render();
    }

    // if mouse pressed on this page
    // check if button pressed
    mousePressed() {
        if (this.play_again.contains(mouseX, mouseY)) {
            this.engine.startGame();
        }
    }

}