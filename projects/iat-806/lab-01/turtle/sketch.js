// KardunTurtle — give the turtle instructions and watch it draw.
//
// Everything you need to change is in this file.

let turtle;

async function setup() {
  createCanvas(800, 600);

  // The turtle's face. Drop any image into this folder and point at it here —
  // it gets scaled and cropped into a circle, so anything roughly square works.
  const cat = await loadImage("cat.jpeg");

  // Make a turtle near the bottom left, facing up.
  turtle = new KardunTurtle(400, 500, cat);

  giveInstructions();
}

// ---------------------------------------------------------------
// YOUR INSTRUCTIONS GO HERE
// --
// -------------------------------------------------------------

const CAT = [
  [
    [0,0],
    [6,1],
    [11,6],
    [10,6],
    [11,9],
    [10,9],
    [11,13],
    [10,13],
    [9,15],
    [10, 18],
    [9,22],
    [5,20],
    [4, 17],
    [2,18],
    [0,18],
    [-2,18],
    [-4, 17],
    [-5,20],
    [-9,22],
    [-10, 18],
    [-9,15],
    [-10,13],
    [-11,13],
    [-10,9],
    [-11,9],
    [-10,6],
    [-11,6],
    [-6,1],
    [0,0]
  ],
  [
    [4,4],
    [0,5],
    [-4,4]
  ],
  [
    [0,5],
    [2,7],
    [0,7],
    [-2,7],
    [0,5]
  ],
  [
    [3,10],
    [5,10],
    [5,12],
    [3,12],
    [3,10]
  ],
  [
    [-3,10],
    [-5,10],
    [-5,12],
    [-3,12],
    [-3,10]
  ]
]

const SCALE = 20;

function calcAngleDegrees(opposite, adjacent) {
  if (adjacent == 0) {
    return 90 * Math.sign(opposite);
  }
  if (opposite == 0) {
    if (adjacent > 0) {
      return 0
    }
    return 180;
  }
  let angle = 180 * Math.atan(Math.abs(opposite) / Math.abs(adjacent)) / Math.PI;
  if (adjacent < 0 & opposite < 0) {
    return angle + 180;
  }
  if (adjacent > 0 & opposite < 0) {
    return 360 - angle;
  }
  if (adjacent < 0 & opposite > 0) {
    return 180 - angle;
  }
  return angle;
}

function point_to_point(x1_raw, y1_raw, x2_raw, y2_raw) {
  let x1 = SCALE*x1_raw + 400;
  let y1 = 500 - SCALE*y1_raw;
  let x2 = SCALE*x2_raw + 400;
  let y2 = 500 - SCALE*y2_raw;
  let angle = calcAngleDegrees(y2 - y1, x2 - x1);
  let distance = Math.sqrt((y2 - y1)**2 + (x2 - x1)**2);
  turtle.setHeading(angle);
  turtle.forward(distance);
}

function draw_contiguous_points(points) {
  let n_points = points.length;
  turtle.goTo(SCALE*points[0][0] + 400, 500 - SCALE*points[0][1]);
  turtle.penDown()
  for (let i = 0; i < n_points - 1; i++) {
    point_to_point(points[i][0], points[i][1], points[i + 1][0], points[i + 1][1]);
  }
  turtle.penUp()
}

function draw_complete(sub_figures) {
  let n_figs = sub_figures.length;
  for (let i = 0; i < n_figs; i++) {
    draw_contiguous_points(sub_figures[i]);
  }
}

function giveInstructions() {
  turtle.penColor("#704d33");
  turtle.penWidth(4);

  // Press a face onto the canvas, so we can see where we started.
  turtle.stamp();
  turtle.penUp()

  draw_complete(CAT)
}

function draw() {
  background("#14161a");
  turtle.update(); // runs the next bit of the instructions and draws everything
}

// Press R to start over.
function keyPressed() {
  if (key === "r" || key === "R") {
    turtle.reset();
    giveInstructions();
  }
}

// ---------------------------------------------------------------
// Everything the turtle understands
// ---------------------------------------------------------------
//
//   turtle.forward(100)        walk forward, drawing if the pen is down
//   turtle.backward(100)       walk backward
//   turtle.right(90)           turn clockwise, in degrees
//   turtle.left(90)            turn counter-clockwise
//
//   turtle.penUp()             stop drawing
//   turtle.penDown()           start drawing again
//   turtle.penColor("red")     any p5 color
//   turtle.penWidth(8)         line thickness
//
//   turtle.goTo(100, 200)      jump to a point
//   turtle.setHeading(0)       0 = right, 90 = down, -90 = up
//   turtle.home()              back to the start, facing up
//   turtle.stamp()             print the turtle's face onto the drawing
//   turtle.erase()             wipe the drawing, keep the turtle
//   turtle.repeat(4, fn)       do a set of instructions n times
//
//   turtle.setSpeed(4)         pixels per frame — bigger is faster
//   turtle.instant()           no animation, draw it all at once
//   turtle.setSize(80)         how big the turtle is drawn
//   turtle.hide() / .show()    show or hide the turtle itself
//   turtle.reset()             clear everything
