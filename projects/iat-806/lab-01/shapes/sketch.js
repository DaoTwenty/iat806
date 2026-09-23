function setup() {
  createCanvas(600, 600);
}

function draw() {
  background(255, 255, 255);
  noStroke();
  fill("#7A6640");
  circle(300, 200, 200);
  triangle(300, 150, 370, 150, 370, 70);
  triangle(300, 150, 230, 250, 230, 70);
  fill("#e795ce");
  triangle(300, 230, 310, 210, 290, 210);
  stroke("black");
  line(300, 230, 320, 250);
  line(300, 230, 280, 250);
  fill("#e80505");
  noStroke();
  rect(220,310,160,30);
  stroke("black");
  fill("#efd702");
  rect(290,315,20,20);
  fill("#a2d886");
  arc(330, 170, 50, 30, 0.6*PI/2, 1.4*PI/2);
  arc(270, 170, 50, 30, 0.6*PI/2, 1.4*PI/2);
  fill("#37afa7");
  noStroke();
  ellipse(300, 340, 10, 20);
}
