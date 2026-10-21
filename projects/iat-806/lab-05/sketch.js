// IAT 806 · Lab 05 starter: the Ball class from Week 5, ready for your website.
// Run with Live Server. Uses p5 2.x.

// an array to put all the balls in.
let balls = [];
// numBalls is written in camelCase.
// you could also write in camel_case
// this is the number of balls that you want to create.
// if your computer is struggling, lower this.
let numBalls = 5000;
// no color variables, no position variables, they are all defined within the class.
function setup() {
  const canvas = createCanvas(600, 600);

  // puts the canvas inside <div id="sketch-holder"> in index.html
  canvas.parent("sketch-holder");

  // we are creating a new instance of a Ball
  //   noStroke();
  // here with this four loop, we create numBalls of balls. and we put them in the array balls.
  for (let i = 0; i < numBalls; i++) {
    let ballX = random(0, 600);
    let ballY = 300;
    let ballC = color(20, 130, 140 + random(-100, 100), 180);
    let ballR = 10;
    let ball = new Ball(ballX, ballY, ballC, ballR);
    balls.push(ball);
    // balls.push(new Ball(ballX, ballY, ballC, ballR));
  }
}

function draw() {
  background(120);

  // they are the same, written in different ways.
  //   for (let i=0; i<numBalls; i++) {
  //     balls[i].move();
  //     balls[i].show();
  //   }

  //   balls.forEach((ball) => {
  //     ball.move();
  //     ball.show();
  //   });
  // we iterate over the array, we move them, and we show them. for ALLLLL of the BALLS.
  for (let ball of balls) {
    // ball.move(random(0, 5));
    // // better to create a method for this.
    // ball.changeSize();
    // ball.show();
    ball.change(2);
  }
}

// this is how we define a class
// attributes
// methods
// this is a blueprint for creating stuff.
// We can create new balls using this.
class Ball {
  // this function is called when an instance of Ball is created.
  // x ix x position
  // y is y position
  // c is color
  // r is radius
  // this is the function that is called when you create a new ball or a new instance of this Class.
  constructor(x, y, c, r) {
    // it's like the instance saying, MY X is 400. In Python the keyword is self.x.
    this.x = x;
    this.y = y;
    this.color = c;
    // ALSO this is a diameter, not radius.
    // This is our mistake... we should have looked at the documentation.
    this.r = r;

    // TODO: if one of your methods needs a new attribute, create it here.
  }

  change(byHowMuch) {
    this.changeSize(byHowMuch);
    this.move(byHowMuch);

    // TODO: call your two new methods here, before show().

    this.show();
  }

  // if this method is called, the ball would move. Every time it is called, it's x and y are changed a little bit.
  move(byHowMuch) {
    // this.x = this.x + random(-5,5)
    this.x += random(-byHowMuch, byHowMuch);
    this.y += random(-byHowMuch, byHowMuch);
  }

  changeSize(byHowMuch) {
    // we fix the size like this:
    // the constrain is saying that it shouldn't grow larger than a certain amount.
    this.r = constrain(this.r + random(-byHowMuch, byHowMuch), 2, 50);
  }

  // TODO: your first new method goes here. Name it for what it does.

  // TODO: your second new method goes here.

  // ????
  // What does ab all need to do?
  // Exist ...
  // You NEED TO SHOW THE BALL
  show() {
    // Here ...
    // Here show is not setting and attributing. It's setting the color of the ball to something.

    fill(this.color);
    circle(this.x, this.y, this.r);
  }
}
