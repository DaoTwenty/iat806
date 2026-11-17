// Assignment 2, repeat music with your head

let game;

function setup() {
    let canvas = createCanvas(600, 400);
    canvas.parent("sketch-holder");
    game = new GameEngine();
    game.load();
}

function draw() {
    game.render();
}

function mousePressed() {
    game.mousePressed();
}

function keyPressed() {
    game.keyPressed();
}